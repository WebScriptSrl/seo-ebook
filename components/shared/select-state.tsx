import { ReviewState } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const SelectState = ({
  options,
  setState,
  state,
  side,
}: {
  options: string[];
  setState: (state: string) => void;
  state: string;
  side?: "left" | "right" | "top" | "bottom";
}) => {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
      <span className="whitespace-nowrap text-sm">Select reviews state</span>

      <Select
        value={state}
        onValueChange={(value) => {
          setState(value as ReviewState);
        }}
      >
        <SelectTrigger className="flex cursor-pointer items-center gap-2">
          <SelectValue placeholder="Moderate review">
            {String(state)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent side={side}>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="capitalize">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
