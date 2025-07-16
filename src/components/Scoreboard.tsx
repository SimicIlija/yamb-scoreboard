'use client';

import { useState, useEffect } from 'react';
import ScoreRow from './ScoreRow';
import HeaderRow from './HeaderRow';

const initialScores: { [key: string]: (number | null)[] } = {
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

const headerLabels = ['↓', 'S', '↑', 'N', 'D', '↕'];

export default function Scoreboard() {
  const [scores, setScores] = useState(initialScores);

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
        console.log(`Row: ${row}, Value: ${intValue}`);

        if (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(row as string) !== -1) {
          const rowNumber = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(row as string) + 1;
          minVal = 0;
          maxVal = 5 * rowNumber;
        } else if (row === 'max' || row === 'min') {
          minVal = 5;
          maxVal = 30;
        }

        if (intValue >= minVal && intValue <= maxVal) {
          const newScores = { ...scores };
          newScores[row][index] = intValue;
          setScores(calculateSums(newScores));
        } else {
          alert(`Please enter a value between ${minVal} and ${maxVal} for ${row}.`);
        }
      } else {
        alert('Please enter a valid number.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-1 mx-auto w-fit">
      <HeaderRow labels={headerLabels} />
      <ScoreRow label="1" values={scores.ones} onCellClick={(index) => handleCellClick('ones', index)} />
      <ScoreRow label="2" values={scores.twos} onCellClick={(index) => handleCellClick('twos', index)} />
      <ScoreRow label="3" values={scores.threes} onCellClick={(index) => handleCellClick('threes', index)} />
      <ScoreRow label="4" values={scores.fours} onCellClick={(index) => handleCellClick('fours', index)} />
      <ScoreRow label="5" values={scores.fives} onCellClick={(index) => handleCellClick('fives', index)} />
      <ScoreRow label="6" values={scores.sixes} onCellClick={(index) => handleCellClick('sixes', index)} />
      <ScoreRow label="Sum" values={scores.sum1} onCellClick={() => {}} readOnly />
      <ScoreRow label="Max" values={scores.max} onCellClick={(index) => handleCellClick('max', index)} />
      <ScoreRow label="Min" values={scores.min} onCellClick={(index) => handleCellClick('min', index)} />
      <ScoreRow label="Sum" values={scores.sum2} onCellClick={() => {}} readOnly />
      <ScoreRow label="Straight" values={scores.straight} onCellClick={(index) => handleCellClick('straight', index)} />
      <ScoreRow label="Trilling" values={scores.trilling} onCellClick={(index) => handleCellClick('trilling', index)} />
      <ScoreRow label="Full" values={scores.full} onCellClick={(index) => handleCellClick('full', index)} />
      <ScoreRow label="Poker" values={scores.poker} onCellClick={(index) => handleCellClick('poker', index)} />
      <ScoreRow label="Yamb" values={scores.yamb} onCellClick={(index) => handleCellClick('yamb', index)} />
      <ScoreRow label="Total Sum" values={scores.totalSum} onCellClick={() => {}} readOnly />
    </div>
  );
}
