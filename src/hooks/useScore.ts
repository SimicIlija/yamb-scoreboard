'use client';

import { useState } from 'react';

export const initialScores: { [key: string]: (number | null)[] } = {
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
  trilling: Array(6).fill(null),
  straight: Array(6).fill(null),
  full: Array(6).fill(null),
  poker: Array(6).fill(null),
  yamb: Array(6).fill(null),
  totalSum: Array(6).fill(null),
};

export default function useScore() {
  const [scores, setScores] = useState(initialScores);
  const [stars, setStars] = useState(0);

  const addStar = () => {
    setStars(stars + 1);
  };

  const removeStar = () => {
    if (stars > 0) {
      setStars(stars - 1);
    }
  };

  const calculateSums = (currentScores: typeof initialScores) => {
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

  const handleCellClick = (row: keyof typeof initialScores, index: number) => {
    const value = prompt(`Enter score for ${row}`);
    if (value !== null) {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        let minVal = 0;
        let maxVal = 80;
        const rowNumber = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(row as string) + 1;
        if (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(row as string) !== -1) {
          
          minVal = 0;
          maxVal = 5 * rowNumber;
          if( intValue % rowNumber !== 0){
          alert(`Value for ${row} must be a multiple of ${rowNumber}`);
          return;
        }
        } else if (row === 'yamb') {
          if (intValue < 0 || intValue > 80 || (intValue - 50) % 5 !== 0) {
            alert('Invalid value for yamb');
            return;
          }
        } else if (row === 'poker') {
          if (intValue < 0 || intValue > 64 || (intValue - 40) % 4 !== 0) {
            alert('Invalid value for poker');
            return;
          }
        } else if (row === 'full') {
          if (intValue < 0 || intValue > 60) {
            alert('Value for full must be between 0 and 60');
            return;
          }
        } else if (row === 'trilling') {
          if (intValue < 0 || intValue > 38 || (intValue - 20) % 3 !== 0) {
            alert('Invalid value for trilling');
            return;
          }
        } else if (row === 'straight') {
          if (![0, 46, 56, 66].includes(intValue)) {
            alert('Value for straight must be 0, 46, 56 or 66');
            return;
          }
        } else if (row === 'max' || row === 'min') {
          minVal = 5;
          maxVal = 30;
        }

        if (intValue >= minVal && intValue <= maxVal) {
          const newScores = { ...scores };
          newScores[row][index] = intValue;
          setScores(calculateSums(newScores));
        } else {
          alert(`Please enter a valid value between ${minVal} and ${maxVal} for ${row}.`);
        }
      } else {
        alert('Please enter a valid number.');
      }
    }
  };

  return { scores, stars, addStar, removeStar, handleCellClick };
}
