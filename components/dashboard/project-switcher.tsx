"use client";

import { useState } from "react";
import Link from "next/link";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Icons } from "../shared/icons";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";

type ProjectType = {
  title: string;
  slug: string;
  color: string;
};

const projects: ProjectType[] = [
  {
    title: "Sponsorships",
    slug: "sponsorships",
    color: "bg-green-500",
  },
  {
    title: "Seo.eBook",
    slug: "seo-ebook",
    color: "bg-cyan-500",
  },
];
const selected: ProjectType = projects[1];

export default function ProjectSwitcher({
  large = false,
}: {
  large?: boolean;
}) {
  const { data: session, status } = useSession();
  const [openPopover, setOpenPopover] = useState(false);

  if (!projects || status === "loading") {
    return <ProjectSwitcherPlaceholder />;
  }

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger
          className="flex h-8 items-center px-2"
          onClick={() => setOpenPopover(!openPopover)}
        >
          <div className="flex items-center space-x-3 pr-2">
            <div
              className={cn("size-3 shrink-0 rounded-full", selected.color)}
            />
            <div className="flex items-center space-x-3">
              <span
                className={cn(
                  "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                  large ? "w-full" : "max-w-[80px]",
                  selected.slug === "sponsorships"
                    ? ""
                    : "text-gradient_cyan-red",
                )}
              >
                {selected.title}
              </span>
            </div>
          </div>
          <ChevronsUpDown
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <ProjectList
            userRole={session && session.user.role ? session.user.role : ""}
            selected={selected}
            projects={projects}
            setOpenPopover={setOpenPopover}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ProjectList({
  userRole,
  selected,
  projects,
  setOpenPopover,
}: {
  userRole: string;
  selected: ProjectType;
  projects: ProjectType[];
  setOpenPopover: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {projects.map(({ slug, color }) => (
        <Link
          key={slug}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          href="#"
          onClick={() => setOpenPopover(false)}
        >
          <div className={cn("size-3 shrink-0 rounded-full", color)} />
          <span
            className={`flex-1 truncate text-sm ${
              selected.slug === slug
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {slug}
          </span>
          {selected.slug === slug ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          ) : (
            <Tooltip>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <TooltipTrigger
                  asChild
                  className="flex size-6 items-center justify-center rounded-full bg-muted"
                >
                  <Icons.help />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="p-2 text-sm"
                >
                  🚧 Implementation in progress
                </TooltipContent>
              </div>
            </Tooltip>
          )}
        </Link>
      ))}

      {userRole.toLowerCase() === "admin" && (
        <Button
          variant="outline"
          className="relative flex h-9 items-center justify-center gap-2 p-2"
          onClick={() => {
            setOpenPopover(false);
          }}
          disabled
        >
          <Plus size={18} className="absolute left-2.5 top-2" />
          <span className="flex-1 truncate text-center">New Project</span>
        </Button>
      )}
    </div>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}
