import { ReviewState } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const SelectProductType = ({
  options,
  setType,
  type,
  side,
}: {
  options: string[];
  setType: (type: string) => void;
  type: string;
  side?: "left" | "right" | "top" | "bottom";
}) => {
  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
      <span className="whitespace-nowrap text-sm">Select product type</span>

      <Select
        value={type}
        onValueChange={(value) => {
          setType(value);
        }}
      >
        <SelectTrigger className="flex cursor-pointer items-center gap-2">
          <SelectValue placeholder="Moderate review">
            {String(type)}
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
