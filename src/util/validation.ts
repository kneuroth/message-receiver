import { Update } from '../model/Update'
import {
  fromUnixTime,
  isSameDay,
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns'
import { toZonedTime } from 'date-fns-tz';

export type ScoreValidationResult =
  | { valid: true; score: number }
  | { valid: false; reason: string }

const WORDLE_SCORE_MATCH_REGEX = /^Wordle (\d{1,2},?\d{3}) ([1-6X])\/6/;

function matchTextFormat(text: string): RegExpMatchArray | null {
  return text.match(WORDLE_SCORE_MATCH_REGEX)
}

function isCorrectWordleNumber(wordleNumber: number): boolean {
  const referenceDate = new Date('2025-07-14') // Wordle #1461
  const referenceNumber = 1486

  const easternNow = toZonedTime(new Date(), 'America/New_York');
  const today = startOfDay(easternNow)

  const days = differenceInCalendarDays(today, referenceDate)
  const expectedNumber = referenceNumber + days

  return wordleNumber === expectedNumber
}

export function isValidScoreForToday(update: Update): ScoreValidationResult {
  const updateDate: Date = fromUnixTime(update.message.date)

  if (!isSameDay(updateDate, new Date())) {
    return { valid: false, reason: 'This update is from the wrong date' }
  }

  const match = matchTextFormat(update.message.text)

  if (!match) {
    return {
      valid: false,
      reason: 'Message text is not formatted correctly',
    }
  }

  const wordleNumber = Number(match[1].replace(',', ''))

  if (!isCorrectWordleNumber(wordleNumber)) {
    return { valid: false, reason: "This is not today's wordle number" }
  }

  const score = isNaN(+match[2]) ? 7 : Number(match[2])

  return { valid: true, score: score }
}
