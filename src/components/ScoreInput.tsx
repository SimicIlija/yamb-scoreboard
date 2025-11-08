"use client";

import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ScoreInputProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: number) => void;
  onDelete: () => void;
  rowLabel: string;
  currentValue: number | null;
  children: React.ReactNode;
}

export default function ScoreInput({
  isOpen,
  onOpenChange,
  onSubmit,
  onDelete,
  rowLabel,
  currentValue,
  children,
}: ScoreInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      // Focus input when popover opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      onSubmit(value);
      onOpenChange(false);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
      setInputValue("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Enter score for {rowLabel}</h4>
            <Input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter score"
              className="w-full"
            />
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
