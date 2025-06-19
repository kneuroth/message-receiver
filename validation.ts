import { WORDLE_SCORE_MATCH_REGEX } from "./constants";
import { Update } from "./model/Update";
import { fromUnixTime, isSameDay, differenceInCalendarDays, startOfDay  } from "date-fns";

export type ScoreValidationResult = { valid: true, score: number } | { valid: false; reason: string };

function matchTextFormat(text: string): RegExpMatchArray | null {
    return text.match(WORDLE_SCORE_MATCH_REGEX);
}

function isCorrectWordleNumber(wordleNumber: number): boolean {
    const referenceDate = new Date("2025-06-19"); // Wordle #1461
    const referenceNumber = 1461;
    const today = startOfDay(new Date());
    const days = differenceInCalendarDays(referenceDate, today);
    const expectedNumber = referenceNumber + days;

    console.log(wordleNumber)
    console.log(expectedNumber)
    
    return wordleNumber === expectedNumber;
}

export function isValidScoreForToday(update: Update): ScoreValidationResult {
    const updateDate: Date = fromUnixTime(update.message.date);

    if (!isSameDay(updateDate, new Date())) {
        return { valid: false, reason: 'This update is from the wrong date'}
    }

    const match = matchTextFormat(update.message.text);
    if (!match) {
        return { valid: false, reason: 'Message text is not formatted correctly'}
    }

    const wordleNumber = Number(match[1].replace(',', ''));

    if(!isCorrectWordleNumber(wordleNumber)) {
        return { valid: false, reason: 'This is not today\'s wordle number' };
    }

    const score = Number(match[2]);

    return { valid: true, score: score };

}