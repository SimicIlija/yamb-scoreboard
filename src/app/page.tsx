'use client';
import Scoreboard from '@/components/Scoreboard';

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold text-center my-4">Yamb Scoreboard</h1>
      <Scoreboard />
    </main>
  );
}
