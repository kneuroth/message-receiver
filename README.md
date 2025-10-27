# Telegram Wordle League

## Message Receiver

This serverless application handles incoming messages from Telegram and records scores

## Tech Stack

- **TypeScript**
- **Serverless Framework**
- **Neon + Drizzle** - For storage and schema
- **Amazon API Gateway (HTTP API)**
- **Zod** – Runtime validation and parsing
- **Telegram API** - For inputs from bot account. These require 200s when a message has come through successfully

## YSK

- User serverless commands to push to AWS:
- Run `serverless deploy` to deploy to dev
- Run `serverless dev` to run locally
- Run `serverless --stage production` to deploy to production evironment
- Be sure to update .env and serverless.yml as needed

- Use drizzle-kit cli tool to make changes to data schema
- Run `npx tsx drizzle/seed.ts` to seed database with dummy data
  - Sometimes there's collisions with the insert, it's just RNG, run it again if you get an error like "Ensure that no rows proposed for insertion within the same command have duplicate constrained values"
- Run `npx tsx drizzle/clear.ts` to clear database
