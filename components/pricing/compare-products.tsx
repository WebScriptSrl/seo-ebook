import { PlansRow } from "@/types";
import { CircleCheck, Info } from "lucide-react";

import { compareProducts, productColumns } from "@/config/products";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export function CompareProducts() {
  const renderCell = (value: string | boolean | null) => {
    if (value === null) return "—";
    if (typeof value === "boolean")
      return value ? <CircleCheck className="mx-auto size-[22px]" /> : "—";
    return value;
  };

  return (
    <MaxWidthWrapper>
      <HeaderSection
        label="Local SEO Books"
        title="Compare Our Books"
        subtitle="Find the perfect book tailored for your business needs!"
      />

      <div className="my-10 overflow-x-scroll max-lg:mx-[-0.8rem] md:overflow-x-visible">
        <table className="w-full table-fixed">
          <thead>
            <tr className="divide-x divide-border border">
              <th className="z-19 left-0 w-40 bg-accent p-5 md:w-1/4"></th>
              {productColumns.map((col) => (
                <th
                  key={col}
                  className="sticky z-10 w-40 bg-accent p-5 font-heading text-base capitalize tracking-wide md:top-14 md:w-auto lg:text-xl"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-x divide-border border">
            {compareProducts.map((row: PlansRow, index: number) => (
              <tr key={index} className="divide-x divide-border border">
                <td
                  data-tip={row.tooltip ? row.tooltip : ""}
                  className="sticky left-0 bg-accent md:bg-transparent"
                >
                  <div className="flex items-center justify-between space-x-2 p-4">
                    <span className="text-[12px] font-medium lg:text-base">
                      {row.feature}
                    </span>
                    {row.tooltip && (
                      <Popover>
                        <PopoverTrigger className="rounded p-1 hover:bg-muted">
                          <Info className="size-[16px] text-muted-foreground" />
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          className="max-w-80 p-3 text-sm"
                        >
                          {row.tooltip}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </td>
                {productColumns.map((col) => (
                  <td
                    key={col}
                    className="p-4 text-center text-[14px] text-muted-foreground lg:text-base"
                  >
                    {renderCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MaxWidthWrapper>
  );
}
