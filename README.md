# Express-Typescript-MongoDb-Jest

This is a simple Express TypeScript API for user authentication.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/try/download/community)

then modify mongoDbUrl in config.json with your url

## Start
npm run start

## Test
npm run test

## Authentication
JWT (JSON Web Tokens) is used for authentication. It provides a stateless, scalable, and secure method for user authentication.

## Encryption
User passwords are hashed using bcrypt before storing them in the database. Bcrypt is a widely used and secure password-hashing library.

## Cors Setup
CORS is configured to allow requests from specified origins. This prevents unauthorized access to the API from other domains.