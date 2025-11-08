'use client';

import { useEffect, useRef } from 'react';
import Scoreboard from '@/components/Scoreboard';
import StarCounter from '@/components/StarCounter';
import useScore from '@/hooks/useScore';

export default function Home() {
  const { scores, stars, addStar, removeStar, handleCellClick, handleScoreSubmit, activeCell, setActiveCell, calculateFinalResult, resetAll } = useScore();
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Request wake lock to prevent screen from turning off
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake lock acquired');
        }
      } catch (error) {
        console.error('Failed to acquire wake lock:', error);
      }
    };

    // Release wake lock when page becomes hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wakeLockRef.current?.released) {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      if (wakeLockRef.current && !wakeLockRef.current.released) {
        wakeLockRef.current.release();
        console.log('Wake lock released');
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center gap-4 my-4">
        <h1 className="text-3xl font-bold text-center">Yamb Scoreboard</h1>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
        >
          Reset
        </button>
      </div>
      <StarCounter stars={stars} addStar={addStar} removeStar={removeStar} />
      <Scoreboard
        scores={scores}
        handleCellClick={handleCellClick}
        handleScoreSubmit={handleScoreSubmit}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
      />
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
