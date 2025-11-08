"use client";

import { useState, useEffect } from "react";

export type ScoreRow =
  | "ones"
  | "twos"
  | "threes"
  | "fours"
  | "fives"
  | "sixes"
  | "sum1"
  | "max"
  | "min"
  | "sum2"
  | "straight"
  | "trilling"
  | "full"
  | "poker"
  | "yamb"
  | "totalSum";

export type Scores = Record<ScoreRow, (number | null)[]>;

export const initialScores: Scores = {
  ones: Array(6).fill(null),
  twos: Array(6).fill(null),
  threes: Array(6).fill(null),
  fours: Array(6).fill(null),
  fives: Array(6).fill(null),
  sixes: Array(6).fill(null),
  sum1: Array(6).fill(null),
  max: Array(6).fill(null),
  min: Array(6).fill(null),
  sum2: Array(6).fill(null),
  straight: Array(6).fill(null),
  trilling: Array(6).fill(null),
  full: Array(6).fill(null),
  poker: Array(6).fill(null),
  yamb: Array(6).fill(null),
  totalSum: Array(6).fill(null),
};

const STORAGE_KEYS = {
  SCORES: "yamb-scores-1",
  STARS: "yamb-stars-1",
};

const loadFromLocalStorage = () => {
  if (typeof window === "undefined") return { scores: initialScores, stars: 0 };

  try {
    const savedScores = localStorage.getItem(STORAGE_KEYS.SCORES);
    const savedStars = localStorage.getItem(STORAGE_KEYS.STARS);

    return {
      scores: savedScores ? JSON.parse(savedScores) : initialScores,
      stars: savedStars ? parseInt(savedStars, 10) : 0,
    };
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return { scores: initialScores, stars: 0 };
  }
};

const saveToLocalStorage = (scores: Scores, stars: number) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    localStorage.setItem(STORAGE_KEYS.STARS, stars.toString());
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export default function useScore() {
  const [scores, setScores] = useState(initialScores);
  const [stars, setStars] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeCell, setActiveCell] = useState<{ row: ScoreRow; index: number } | null>(null);

  // Load data from localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
    const { scores: savedScores, stars: savedStars } = loadFromLocalStorage();
    setScores(savedScores);
    setStars(savedStars);
  }, []);

  // Save to localStorage whenever data changes (but not on initial hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToLocalStorage(scores, stars);
    }
  }, [scores, stars, isHydrated]);

  const addStar = () => {
    setStars(stars + 1);
  };

  const removeStar = () => {
    if (stars > 0) {
      setStars(stars - 1);
    }
  };

  const calculateSums = (currentScores: Scores) => {
    const newScores = { ...currentScores };

    for (let i = 0; i < 6; i++) {
      let sum1 =
        (newScores.ones[i] || 0) +
        (newScores.twos[i] || 0) +
        (newScores.threes[i] || 0) +
        (newScores.fours[i] || 0) +
        (newScores.fives[i] || 0) +
        (newScores.sixes[i] || 0);
      if (sum1 >= 60) {
        sum1 += 30;
      }
      newScores.sum1[i] = sum1 > 0 ? sum1 : null;

      const maxVal = newScores.max[i] || 0;
      const minVal = newScores.min[i] || 0;
      if (maxVal > 0 && minVal > 0) {
        let calculatedSum2 = (maxVal - minVal) * (newScores.ones[i] || 0);
        if (calculatedSum2 >= 60) {
          calculatedSum2 += 30;
        }
        newScores.sum2[i] = calculatedSum2;
      } else {
        newScores.sum2[i] = null;
      }

      const totalSum =
        (newScores.sum1[i] || 0) +
        (newScores.sum2[i] || 0) +
        (newScores.straight[i] || 0) +
        (newScores.trilling[i] || 0) +
        (newScores.full[i] || 0) +
        (newScores.poker[i] || 0) +
        (newScores.yamb[i] || 0);
      newScores.totalSum[i] = totalSum > 0 ? totalSum : null;
    }
    return newScores;
  };

  const handleCellClick = (row: ScoreRow, index: number) => {
    setActiveCell({ row, index });
  };

  const handleScoreSubmit = (value: number) => {
    if (!activeCell) return;

    const { row, index } = activeCell;
    const intValue = value;

    let minVal = 0;
    let maxVal = 80;
    const rowNumber =
      ["ones", "twos", "threes", "fours", "fives", "sixes"].indexOf(
        row as string
      ) + 1;

    if (
      ["ones", "twos", "threes", "fours", "fives", "sixes"].indexOf(
        row as string
      ) !== -1
    ) {
      minVal = 0;
      maxVal = 5 * rowNumber;
      if (intValue % rowNumber !== 0) {
        alert(`Value for ${row} must be a multiple of ${rowNumber}`);
        return;
      }
    } else if (row === "yamb") {
      if (intValue < 0 || intValue > 80 || (intValue - 50) % 5 !== 0) {
        alert("Invalid value for yamb");
        return;
      }
    } else if (row === "poker") {
      if (intValue < 0 || intValue > 64 || (intValue - 40) % 4 !== 0) {
        alert("Invalid value for poker");
        return;
      }
    } else if (row === "full") {
      if (intValue < 0 || intValue > 60) {
        alert("Value for full must be between 0 and 60");
        return;
      }
    } else if (row === "trilling") {
      if (
        intValue < 0 ||
        intValue > 38 ||
        (intValue !== 0 && (intValue - 20) % 3 !== 0)
      ) {
        alert("Invalid value for trilling");
        return;
      }
    } else if (row === "straight") {
      if (![0, 46, 56, 66].includes(intValue)) {
        alert("Value for straight must be 0, 46, 56 or 66");
        return;
      }
    } else if (row === "max" || row === "min") {
      minVal = 5;
      maxVal = 30;
    }

    if (intValue >= minVal && intValue <= maxVal) {
      const newScores = { ...scores };
      newScores[row][index] = intValue;
      setScores(calculateSums(newScores));
      setActiveCell(null);
    } else {
      alert(
        `Please enter a valid value between ${minVal} and ${maxVal} for ${row}.`
      );
    }
  };

  const handleScoreDelete = () => {
    if (!activeCell) return;

    const { row, index } = activeCell;
    const newScores = { ...scores };
    newScores[row][index] = null;
    setScores(calculateSums(newScores));
    setActiveCell(null);
  };

  const calculateFinalResult = () => {
    const totalSumRow = scores.totalSum;
    const sumOfTotalSums = totalSumRow.reduce(
      (sum: number, value) => sum + (value || 0),
      0
    );
    return sumOfTotalSums + stars * 20;
  };

  const resetAll = () => {
    const freshScores: Scores = {
      ones: Array(6).fill(null),
      twos: Array(6).fill(null),
      threes: Array(6).fill(null),
      fours: Array(6).fill(null),
      fives: Array(6).fill(null),
      sixes: Array(6).fill(null),
      sum1: Array(6).fill(null),
      max: Array(6).fill(null),
      min: Array(6).fill(null),
      sum2: Array(6).fill(null),
      straight: Array(6).fill(null),
      trilling: Array(6).fill(null),
      full: Array(6).fill(null),
      poker: Array(6).fill(null),
      yamb: Array(6).fill(null),
      totalSum: Array(6).fill(null),
    };
    setScores(freshScores);
    setStars(0);
  };

  return {
    scores,
    stars,
    addStar,
    removeStar,
    handleCellClick,
    handleScoreSubmit,
    handleScoreDelete,
    activeCell,
    setActiveCell,
    calculateFinalResult,
    resetAll,
  };
}
