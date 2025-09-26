'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const headerLabels = ['↓', 'S', '↑', 'N', 'D', '↕'];
const rowLabels = [
  '1', '2', '3', '4', '5', '6', 'Sum', 'Max', 'Min', 'Sum', 'Trilling', 'Straight', 'Full', 'Poker', 'Yamb', 'Total Sum'
];

export default function Scoreboard({ scores, handleCellClick }: { scores: { [key: string]: (number | null)[] }, handleCellClick: (row: string, index: number) => void }) {
  return (
    <div className="overflow-x-auto">
      <Table className="max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20"></TableHead>
            {headerLabels.map((label, index) => (
              <TableHead key={index} className="text-center">{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(scores).map((key, rowIndex) => (
            <TableRow key={key}>
              <TableCell className="font-medium text-left border">{rowLabels[rowIndex]}</TableCell>
              {scores[key as keyof typeof scores].map((score, cellIndex) => {
                const isSumRow = key.toLowerCase().includes('sum');
                return (
                  <TableCell
                    key={cellIndex}
                    className={`text-center border ${isSumRow ? 'bg-white text-black' : ''}`}
                    onClick={() => !isSumRow && handleCellClick(key as keyof typeof scores, cellIndex)}
                  >
                    {score}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
