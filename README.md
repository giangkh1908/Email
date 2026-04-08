# Email Service

This is a [NestJS](https://nestjs.com/) REST API for managing and sending emails, built with TypeScript and connected to MongoDB.

## Tech Stack
- **Framework:** NestJS
- **Database:** MongoDB (Mongoose)
- **Environment:** Node.js

## Project setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
Create a `.env` file in the root directory and add your MongoDB connection string:
```bash
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

## Running the application

```bash
# development
npm run start

# watch mode (recommended for development)
npm run start:dev

# production mode
npm run start:prod
```

## Running tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

