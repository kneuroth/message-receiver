import {
  BIG_SMILE_PNG,
  FIRE_PNG,
  CLAP_PNG,
  CIRCLE_PNG,
  CRYING_PNG,
  X_EYES_PNG,
  CLOWN_PNG,
} from "./png-icons";

// Score meaning in Wordle:
// 0 = solved in 1 (exceptional)
// 1 = solved in 1 (amazing)
// 2 = solved in 2 (excellent)
// 3 = solved in 3 (great)
// 4 = solved in 4 (ok)
// 5 = solved in 5 (meh)
// 6 = solved in 6 (close call)
// 7 = failed (X/7)
// 8 = didn't play (penalty)

export const MATRIX_PNG_SCORE_MAP: { [key: number]: string } = {
  0: BIG_SMILE_PNG,  // Exceptional
  1: BIG_SMILE_PNG,  // Solved in 1
  2: FIRE_PNG,       // Solved in 2
  3: CLAP_PNG,       // Solved in 3
  4: CIRCLE_PNG,     // Solved in 4 (neutral)
  5: CIRCLE_PNG,     // Solved in 5 (meh)
  6: CRYING_PNG,     // Solved in 6 (close call)
  7: X_EYES_PNG,     // Failed
  8: CLOWN_PNG,      // Didn't play (penalty)
};

export const MATRIX_PNG_PODIUM_MAP: { [key: number]: string } = {
  1: BIG_SMILE_PNG,  // Winner
  2: FIRE_PNG,       // Second place
  3: CLAP_PNG,       // Third place
}

// Podium positions (1st, 2nd, 3rd place)
export const DEFAULT_PNG_PODIUM_MAP: { [key: number]: string } = {
  1: BIG_SMILE_PNG,  // Winner
  2: FIRE_PNG,       // Second place
  3: CLAP_PNG,       // Third place
};
