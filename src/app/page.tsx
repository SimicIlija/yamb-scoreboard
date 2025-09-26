'use client';

import Scoreboard from '@/components/Scoreboard';
import StarCounter from '@/components/StarCounter';
import useScore from '@/hooks/useScore';

export default function Home() {
  const { scores, stars, addStar, removeStar, handleCellClick, calculateFinalResult } = useScore();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-center my-4">Yamb Scoreboard</h1>
      <StarCounter stars={stars} addStar={addStar} removeStar={removeStar} />
      <Scoreboard scores={scores} handleCellClick={handleCellClick} />
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-xl font-bold text-center text-black">Final Result</h2>
        <p className="text-2xl font-bold text-center text-blue-800">
          {calculateFinalResult()} points
        </p>
        <p className="text-sm text-center text-gray-600 mt-1">
          (Total Sum + {stars} × 20 star bonus)
        </p>
      </div>
    </main>
  );
}
