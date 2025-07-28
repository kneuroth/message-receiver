import { drizzle } from "drizzle-orm/node-postgres";
import { scoreTable } from "../src/db/schema";
import 'dotenv/config';
import { sql } from "drizzle-orm";
async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await db.execute(sql`DELETE FROM ${scoreTable};`);
}
main();