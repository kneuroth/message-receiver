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

- Use drizzle-kit cli tool to make changes to data schema
