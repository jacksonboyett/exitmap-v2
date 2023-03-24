import pool from "../pool-config";
import crypto from "crypto";

// i don't think these should be input elements
export interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  hashed_password: Buffer;
  salt: Buffer;
  is_approved: boolean;
  is_admin: boolean;
  is_deleted: boolean;
}

export async function addUser({
  first_name,
  last_name,
  username,
  email,
  hashed_password,
}: UserData) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO users (
        first_name,
				last_name,
				username,
				email,
				hashed_password) values ($1,$2,$3,$4,$5)
        RETURNING *`,
      [first_name, last_name, username, email, hashed_password],
      (err, results) => {
        if (err) {
          console.log('YOU A BITCH BITCH')
          reject(err);
        }
        // console.log(results)
        resolve(results);
      }
    );
  });
}

export async function populateTestUsers() {
  let salt = crypto.randomBytes(16)
  pool.query('INSERT INTO users (username, first_name, last_name, email, hashed_password, salt, is_approved, is_admin, is_deleted) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING ', 
  [
    'j', 
    'j', 
    'j', 
    'j@j.j', 
    crypto.pbkdf2Sync('j', salt, 310000, 32, 'sha256'),
    salt, 
    true, 
    true, 
    false
  ],
  )
  pool.query('INSERT INTO users (username, first_name, last_name, email, hashed_password, salt, is_approved, is_admin, is_deleted) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING ', 
  [
    'l', 
    'l', 
    'l', 
    'l@l.l', 
    crypto.pbkdf2Sync('l', salt, 310000, 32, 'sha256'),
    salt, 
    true, 
    true, 
    false
  ],
  )
  pool.query('INSERT INTO users (username, first_name, last_name, email, hashed_password, salt, is_approved, is_admin, is_deleted) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING ', 
  [
    'c', 
    'c', 
    'c', 
    'c@c.c', 
    crypto.pbkdf2Sync('c', salt, 310000, 32, 'sha256'),
    salt, 
    true, 
    true, 
    false
  ],
  )
}
