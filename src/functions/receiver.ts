import { scoreTable } from '@db/schema';
import { updateSchema } from '@model/Update';
import { neon } from '@neondatabase/serverless';
import { isValidScoreForToday } from '@utils/validation';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function receiveMessage(
  req: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!req.body) {
    return {
      statusCode: 200,
      body: 'No body',
    }
  }

  const body = JSON.parse(req.body)
  const updateParse = updateSchema.safeParse(body)

  if (!updateParse.success) {
    console.log('Invalid telegram Update:', req.body)
    console.error('Error:', updateParse.error.issues)

    return {
      statusCode: 200,
      body: 'Invalid telegram Update',
    }
  }

  const update = updateParse.data

  // We have a valid Telegram Update
  // Is it a score?
  let validatedScore = isValidScoreForToday(update)

  if (validatedScore.valid) {
    const result = await db.insert(scoreTable).values({
      player_id: update.message.from.id,
      chat_id: update.message.chat.id,
      score: validatedScore.score,
      player_name: update.message.from.first_name,
      // write date in America/New_York (Eastern) timezone as YYYY-MM-DD
      date: format(toZonedTime(new Date(), 'America/New_York'), 'yyyy-MM-dd')
    }).onConflictDoUpdate({ target: [scoreTable.player_id, scoreTable.chat_id, scoreTable.date], set: { score: validatedScore.score } })
    return {
      statusCode: 200,
      body: 'Score is valid',
    }

  } else {
    // Not a score.. what should we do?
    console.error(validatedScore.reason)
    return {
      statusCode: 200,
      body: validatedScore.reason,
    }
  }
}
