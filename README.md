# **ExitMap**

exit-map.com

### Created by [Luke Boyett](https://lboyett.com) and [Jackson Boyett](https://jacksonboyett.com)

1. [Introduction](#introduction)
2. [Stack](#stack)
3. [Session Management](#session-management)
4. [Handling User-Uploaded Images](#handling-user-uploaded-images)
5. [Authentication](#authentication)
6. [Cost](#cost)
7. [Hosting](#hosting)
8. [APIs](#apis)
9. [Conclusion](#conclusion)

## Introduction

Jackson and I began our BASE jumping journey in 2017. Since then, we've accumulated roughly 1000 BASE jumps between the two of us. Dissatisfied with our current careers, we started The Odin Project in October 2022 hoping to transition into the world of web development.
After completing The Odin Project, Jackson and I wanted to continue improving our skills, especially regarding backend development. Originally, ExitMap was supposed to be released to only a small group of friends as a way to share knowledge of different BASE jumping locations. Throughout development, it evolved into a full scale application incorporating different frontend and backend systems, complete with user management.

## Stack

### TypeScript

We chose to write ExitMap entirely in TypeScript. Adding type safety among other features has undoubtedly saved us countless hours in development. Although sometimes TS errors can be annoying, ExitMap is more rigid and scalable due to the decsion to use TypeScript.

### React / Vite

ExitMap is built on React/Vite for the frontend and Node/Express for the backend. Since ExitMap began as a portfolio piece, Jackson and I wanted to use this as an opportunity to build a full-stack application with React. We used Vite for hot module replacement and ability to speed up development times.

### NodeJS / Express

The Odin Project teaches JavaScript, so having already been comfortable writing JS, it made sense for us to utilize these skills with the backend. Since the start of ExitMap, we have spent time learning Python and exploring Django. If I could start over, I would definitely consider creating the backend for ExitMap in Django due to is out-the-box user management, which has been a considerable challenge in Express.

### PostgreSQL

We learned MongoDB during The Odin Project, but having explored alternatives, we determined that a relational database is ultimately the right database for ExitMap. All of the data is entirely realtional, after all. While I don't think Postgres has a particular advantage over MySQL regarding ExitMap, we chose PostgresQL due to its postive reviews and wide support.

### Amazon S3

We chose Amazon S3 to store all user-uploaded images due to its low cost and wide support. I'll discuss the S3 specifics Handling User-Uploaded Images

## Session Management

### JSON Web Tokens vs. Cookies

Originally, we wanted to use JWT to authenticate users during a session. However, I think there are a few issues with using JWT for sessions. The most significant issue is the inability for admins to log out users with a valid JWT. After a few days of trying to use JWT, we opted instead for the tried-and-true method of using session cookies. The issue with using cookies is the added complexity of having to store session information server-side. In reality, this turned out to not be much of an issue because it does not add that much complexity and gives us the ability to view and control active sessions. JWT may be trendy right now, but in our opinion, using cookies the best option for user sessions.

### Redis

We decided to use Redis to store session data due to its high speed and widespread support. Redis was extremely easy to implement, and it gives us the ability to log out users if necessary.

## Handling User-Uploaded Images

Arguably the most difficult part of handling user-uploaded images is determining the correct way to do so. Implementation is relatively straight forward. Several problems occur when incorporating user-uploaded images to include:

- Page Speed
- Cost
- Storage

The issue with user-uploaded images is that there are many different file types and sizes that a user can upload. We incorporated file validation that prevents users from uploading files that are not images and files that are too large. We chose to store images in AWS S3 due to its low cost and wide support among CDNs. ExitMap has potential to be image-heavy depending on the page, so we explored image optimization tools extensively. Imgix and Cloudinary seem to be the most popular services, but they can be somewhat expensive, and we are trying to keep ExitMap as low-cost as possible. We decided to use Imagekit due to its free 20GB monthly bandwidth. Imagekit links directly into our S3 bucket, which implementation extremely easy. Using Imagekit in combination with S3 provided us with an affordable, but effective, solution to handling user-uploaded images.

##Authentication
Due to safety concerns of giving non-jumpers the ability to comment and add jumps, we decided to only allow jumpers to use email and password to login after being approved by an admin. We spent a week or so trying to implement Passport.js as the system for authenticating users. Since ExitMap is a small application without the ability to login using Google or Facebook, we found Passport to be too heavy of a framework for this size application. Rather, we utilized the Crypto module native to Node to encrypt and validate passwords.

## Cost

One of our main considerations when making ExitMap was the cost. Easy solutions are often the most expensive solutions. We've researched extensively to find services with generous free tiers of which we can advantage. Using Digital Ocean's App Platform, we only pay $5 to host the server. We utilize ElephantSQL's and Redis's free tiers to host ExitMap's databases. However, we are likely going to upgrade our Postgres database to a $5 per month plan to provide regular database backups. We've optimized ExitMap's frontend to make as little API requests as possible.

### Overall monthly cost: $5

## Hosting

### Frontend

Due to the fact that we are using Vite, we decided to use Vercel to host ExitMap's frontend. Vercel is extremely easy to use and updates after every push to GitHub.

### Backend

We decided to use Digital Ocean to host ExitMap's server due to its low cost and ease of use. AWS and Azure seemed to be too heavy for ExitMap, which is a relatively small application. Digital Ocean provided an affordable solution with an easy DNS configuration.

## APIs

We've utilized multple APIs in ExitMap to include:

- Google Maps JavaScript API
- Google Geocoding API
- Google Places API
- reCAPTCHA
- Nodemailer API
- AWS SDK
- Zoho

## Conclusion

If you are looking to hire one of us, we hope you are impressed with ExitMap. We put months of work into it. If you are a BASE jumper, we hope you enjoy ExitMap and find new jumps because of it. ExitMap is still an active project that we are working on every day, so if you have any questions or recommendations, feel free to contact us.

- lboyett@gmail.com
- jackson.boyett@gmail.com
