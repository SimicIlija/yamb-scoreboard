'use client';

export default function StarCounter({ stars, addStar, removeStar }: { stars: number, addStar: () => void, removeStar: () => void }) {
  return (
    <div className="flex items-center gap-4 my-4">
      <button onClick={removeStar} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
      <div className="text-2xl font-bold">Stars: {stars}</div>
      <button onClick={addStar} className="px-4 py-2 bg-green-500 text-white rounded">+</button>
    </div>
  );
}
