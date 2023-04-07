import express, { Express, NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { QueryResult } from "pg";
import uniqid from "uniqid";
import path from "path";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

import {
  getExit,
  getReviewedExits,
  addExit,
  deleteExit,
  getExitsByUser,
} from "../controllers/exitController";
import {
  getExitImages,
  addImage,
  getMainImageData,
} from "../controllers/imageController";
import {
  getExitComments,
  addComment,
  getCommentsByUser,
  deleteComment,
} from "../controllers/commentController";
import {
  addUser,
  populateTestUsers,
  UserData as UserDataType,
  getUserById,
  putUserAvatar,
} from "../controllers/userController";
import authorizeUser from "../utils/authorizeUser";
const router = express.Router();

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.signedCookies.token
    ? req.signedCookies.token
    : req.cookies.token;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
    if (err) {
      console.log("theres an error");
      console.log(err);
      return res.status(403).send("authentication failure");
    }
    next();
  });
}

router.get("/test-authorization", authorizeUser, (req, res) => {
  res.send("ok");
});

// =========================== Exits ===========================

router.get("/exits/reviewed", async (req, res, next) => {
  try {
    const response = await getReviewedExits();
    res.send(response);
  } catch (err) {
    res.status(500).send("error");
  }
});

router.get("/exits/:id", async (req, res, next) => {
  try {
    let results: any = {};
    const exitData = await getExit(req.params.id);
    aggregate("data", exitData);
    const exitImages = await getExitImages(req.params.id);
    aggregate("images", exitImages);
    const exitComments = await getExitComments(req.params.id);
    aggregate("comments", exitComments);
    function aggregate(name: string, data: any) {
      results[name] = data;
      if (results.data && results.images && results.comments) {
        res.json(results);
      }
    }
  } catch (err) {
    res.status(500).send("Internal server error in the getExit request");
  }
});

router.post("/exits", async (req, res, next) => {
  const exit_data = req.body;
  try {
    const response = (await addExit(exit_data)) as QueryResult;
    res.status(200).send(response); //FixThis
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.delete("/exits/:id", async (req, res, next) => {
  try {
    const response = (await deleteExit(+req.params.id)) as QueryResult | number;
    if (response === 0) throw new Error("Delete failed");
    res.status(200).send(response.toString()); //FixThis
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.get("/exits/by-user-id/:id", async (req, res, next) => {
  const user_id = req.params.id as string;
  try {
    const exits = (await getExitsByUser(user_id)) as any[];
    res.send(exits);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

//================== USERS AND AUTHENTICATION ==========================

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/populate-test-users", authenticateToken, (req, res, next) => {
  populateTestUsers();
});

router.post("/users", async (req, res, next) => {
  const user_data = req.body.headers;
  try {
    const response = await addUser(user_data);
    res.send("OK");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/current-user", authorizeUser, async (req, res) => {
  try {
    const user = await getUserById(res.locals.toString());
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("internal server error");
  }
});

router.get("/users/:user_id", async (req, res) => {
  const id = req.params.user_id;
  console.log("ran");
  try {
    const user = await getUserById(id);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("internal server error");
  }
});

router.put("/images/avatars/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const { key } = req.body;
  try {
    await putUserAvatar(user_id, key);
    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

//=========================== IMAGES ===========================

const s3 = new S3Client({
  apiVersion: "2006-03-01",
  region: "eu-central-1",
});

const bucketName = "lboyett-exitmap-v2";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.filename });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${uniqid()}${ext}`);
    },
  }),
}).single("image");

function uploadFile(req: Request, res: Response, next: Function) {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(500).send("A multer error occured during upload");
    } else if (err) {
      console.log(err);
      res.status(500).send("An unknown error occured during upload");
    } else {
      next();
    }
  });
}

router.get("/signed-url", async (req, res, next) => {
  const key = `${Date.now()}-${uniqid()}`;
  const s3 = new S3Client({
    apiVersion: "2006-03-01",
    region: "eu-central-1",
  });
  const command = new PutObjectCommand({
    Bucket: "lboyett-exitmap-v2",
    Key: key,
  });
  try {
    const url = await getSignedUrl(s3 as any, command as any, {
      expiresIn: 30,
    });
    res.send({ signedUrl: url, key: key });
  } catch (err) {
    console.log(err);
  }
});

router.post("/images", async (req, res, next) => {
  const { submitted_by, exit, url, key } = req.body;
  try {
    const response = (await addImage(
      submitted_by,
      exit,
      url,
      key
    )) as QueryResult;
    res.status(200).send(response.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/images/:exit_id/main", async (req, res, next) => {
  try {
    const data = await getMainImageData(req.params.exit_id);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

//============================COMMENTS============================
router.post("/comments", async (req, res, next) => {
  try {
    const response = await addComment(
      req.body.comment,
      req.body.author_id,
      req.body.exit_id
    );
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/comments/by-user-id/:id", async (req, res, next) => {
  const user_id = req.params.id as string;
  try {
    const comments = (await getCommentsByUser(user_id)) as any[];
    res.send(comments);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

router.delete("/comments/:comment_id", async (req, res, next) => {
  const comment_id = req.params.comment_id;
  try {
    const response = await deleteComment(comment_id);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

export default router;
