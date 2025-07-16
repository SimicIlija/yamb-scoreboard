type ScoreCellProps = {
  value: number | null;
  onClick: () => void;
  readOnly?: boolean;
};

export default function ScoreCell({ value, onClick, readOnly }: ScoreCellProps) {
  return (
    <div
      className={`w-12 h-12 border border-gray-400 flex items-center justify-center text-xl font-bold ${readOnly ? 'bg-gray-200 text-black' : 'cursor-pointer'}`}
      onClick={!readOnly ? onClick : undefined}
    >
      {value}
    </div>
  );
}
