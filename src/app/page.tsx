'use client';

import Scoreboard from '@/components/Scoreboard';
import StarCounter from '@/components/StarCounter';
import useScore from '@/hooks/useScore';

export default function Home() {
  const { scores, stars, addStar, removeStar, handleCellClick } = useScore();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-center my-4">Yamb Scoreboard</h1>
      <StarCounter stars={stars} addStar={addStar} removeStar={removeStar} />
      <Scoreboard scores={scores} handleCellClick={handleCellClick} />
    </main>
  );
}
