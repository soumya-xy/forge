"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GitBranch, Plus } from "lucide-react";
import { IdeaBranch } from "@/types/types";

interface BranchSwitcherProps {
  branches: IdeaBranch[];
  activeBranchId?: string;
  onBranchSelect: (branchId: string) => void;
  onCreateNewBranch?: () => void;
  isLoading?: boolean;
}

export default function BranchSwitcher({
  branches,
  activeBranchId,
  onBranchSelect,
  onCreateNewBranch,
  isLoading = false,
}: BranchSwitcherProps) {
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || branches.length === 0}
            className="h-8 px-3 gap-2 bg-white hover:bg-stone-50 border-stone-300"
          >
            <GitBranch className="w-4 h-4" />
            <span className="font-medium text-sm">
              {activeBranch ? activeBranch.name : "Select Branch"}
            </span>
            {activeBranch && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeBranch.color }}
              />
            )}
            <Badge
              variant="secondary"
              className="ml-1 text-xs bg-stone-100 text-stone-600 hover:bg-stone-200"
            >
              {branches.length}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {branches.map((branch) => (
            <DropdownMenuItem
              key={branch.id}
              onClick={() => onBranchSelect(branch.id)}
              className="gap-2 cursor-pointer"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: branch.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#1A1A1A]">{branch.name}</div>
                <div className="text-xs text-[#1A1A1A]/60">
                  {branch.posture.name} — {branch.posture.posture}
                </div>
              </div>
              {branch.id === activeBranchId && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}

          {onCreateNewBranch && branches.length < 3 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onCreateNewBranch}
                className="gap-2 cursor-pointer text-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Branch</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
