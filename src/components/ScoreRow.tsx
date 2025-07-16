import ScoreCell from "./ScoreCell";

type ScoreRowProps = {
  label: string;
  values: (number | null)[];
  onCellClick: (index: number) => void;
  readOnly?: boolean;
};

export default function ScoreRow({ label, values, onCellClick, readOnly }: ScoreRowProps) {
  return (
    <div className="flex items-center">
      <div className="w-32 pr-2 text-right font-bold">{label}</div>
      {values.map((value, index) => (
        <ScoreCell key={index} value={value} onClick={() => onCellClick(index)} readOnly={readOnly} />
      ))}
    </div>
  );
}
