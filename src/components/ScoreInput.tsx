"use client";

import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScoreInputProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: number) => void;
  onDelete: () => void;
  rowLabel: string;
  columnLabel: string;
  currentValue: number | null;
  rowType: string;
  children: React.ReactNode;
}

const getValidationHint = (rowType: string): string => {
  const rowNumber = ["ones", "twos", "threes", "fours", "fives", "sixes"].indexOf(rowType) + 1;

  if (rowNumber > 0) {
    const maxVal = 5 * rowNumber;
    return `Multiple of ${rowNumber} (0-${maxVal})`;
  }

  switch (rowType) {
    case "straight":
      return "0, 46, 56, or 66";
    case "trilling":
      return "0, 20, 23, 26, 29, 32, 35, or 38";
    case "full":
      return "0-60";
    case "poker":
      return "0, 40, 44, 48, 52, 56, 60, or 64";
    case "yamb":
      return "0, 50, 55, 60, 65, 70, 75, or 80";
    case "max":
    case "min":
      return "5-30";
    default:
      return "";
  }
};

const validateInput = (value: number, rowType: string): string | null => {
  const rowNumber = ["ones", "twos", "threes", "fours", "fives", "sixes"].indexOf(rowType) + 1;

  if (rowNumber > 0) {
    const maxVal = 5 * rowNumber;
    if (value % rowNumber !== 0) {
      return `Value must be a multiple of ${rowNumber}`;
    }
    if (value < 0 || value > maxVal) {
      return `Value must be between 0 and ${maxVal}`;
    }
    return null;
  }

  switch (rowType) {
    case "straight":
      if (![0, 46, 56, 66].includes(value)) {
        return "Value must be 0, 46, 56, or 66";
      }
      break;
    case "trilling":
      if (value < 0 || value > 38 || (value !== 0 && (value - 20) % 3 !== 0)) {
        return "Invalid value for trilling";
      }
      break;
    case "full":
      if (value < 0 || value > 60) {
        return "Value must be between 0 and 60";
      }
      break;
    case "poker":
      if (value < 0 || value > 64 || (value !== 0 && (value - 40) % 4 !== 0)) {
        return "Invalid value for poker";
      }
      break;
    case "yamb":
      if (value < 0 || value > 80 || (value !== 0 && (value - 50) % 5 !== 0)) {
        return "Invalid value for yamb";
      }
      break;
    case "max":
    case "min":
      if (value < 5 || value > 30) {
        return "Value must be between 5 and 30";
      }
      break;
  }

  return null;
};

export default function ScoreInput({
  isOpen,
  onOpenChange,
  onSubmit,
  onDelete,
  rowLabel,
  columnLabel,
  currentValue,
  rowType,
  children,
}: ScoreInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setError(null);
      // Focus input when popover opens
      // setTimeout with 0ms is used to defer focus until after the popover is fully rendered
      // This ensures the input element is visible and accessible in the DOM
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(inputValue, 10);

    if (isNaN(value)) {
      setError("Please enter a valid number");
      return;
    }

    const validationError = validateInput(value, rowType);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(value);
    onOpenChange(false);
    setInputValue("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
      setInputValue("");
      setError(null);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64" side="top" align="center" sideOffset={10} avoidCollisions={true}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Enter score for {rowLabel} ({columnLabel})</h4>
            {getValidationHint(rowType) && (
              <p className="text-xs text-gray-500">
                Valid values: {getValidationHint(rowType)}
              </p>
            )}
            <Input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter score"
              className="w-full"
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex gap-2 justify-between">
            {currentValue !== null && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete();
                  setInputValue("");
                }}
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  setInputValue("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
