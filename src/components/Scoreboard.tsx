'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Scores, ScoreRow } from "@/hooks/useScore";
import ScoreInput from "@/components/ScoreInput";

const headerLabels = ['↓', 'S', '↑', 'N', 'D', '↕'];
const rowLabels = [
  '1', '2', '3', '4', '5', '6', '𝝨', 'MAX', 'MIN', '𝝨', 'S', 'T', 'F', 'P', 'Y', '𝝨'
];

interface ScoreboardProps {
  scores: Scores;
  handleScoreSubmit: (value: number) => void;
  handleScoreDelete: () => void;
  activeCell: { row: ScoreRow; index: number } | null;
  setActiveCell: (cell: { row: ScoreRow; index: number } | null) => void;
}

export default function Scoreboard({
  scores,
  handleScoreSubmit,
  handleScoreDelete,
  activeCell,
  setActiveCell
}: ScoreboardProps) {
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
                const rowKey = key as ScoreRow;
                const isActive = activeCell?.row === rowKey && activeCell?.index === cellIndex;

                if (isSumRow) {
                  return (
                    <TableCell
                      key={cellIndex}
                      className="text-center border bg-white text-black"
                    >
                      {score}
                    </TableCell>
                  );
                }

                return (
                  <ScoreInput
                    key={cellIndex}
                    isOpen={isActive}
                    onOpenChange={(open) => {
                      if (!open) setActiveCell(null);
                    }}
                    onSubmit={handleScoreSubmit}
                    onDelete={handleScoreDelete}
                    rowLabel={rowLabels[rowIndex]}
                    currentValue={score}
                  >
                    <TableCell
                      className="text-center border cursor-pointer hover:bg-gray-100"
                      onClick={() => setActiveCell({ row: rowKey, index: cellIndex })}
                    >
                      {score}
                    </TableCell>
                  </ScoreInput>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
