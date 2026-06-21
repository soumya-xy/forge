"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BranchComparisonSlider from "@/components/ui/BranchComparisonSlider";
import { GitBranch, GitMerge, ArrowRight, CheckCircle2, Info, List } from "lucide-react";
import { IdeaBranch, MilestonePlan, MergePhaseSelection } from "@/types/types";

interface StageVersioningDiffProps {
  branches: IdeaBranch[];
  onMerge: (phaseSelection: MergePhaseSelection) => void;
  onBranchSelect: (branchId: string) => void;
  activeBranchId?: string;
  isLoading?: boolean;
}

const PHASES = ['day30', 'day60', 'day90'] as const;

const PHASE_LABELS = {
  day30: 'Day 30 (Validation)',
  day60: 'Day 60 (Execution)',
  day90: 'Day 90 (Optimization)',
};

export default function StageVersioningDiff({
  branches,
  onMerge,
  onBranchSelect,
  activeBranchId,
  isLoading = false,
}: StageVersioningDiffProps) {
  const [selectedPhases, setSelectedPhases] = useState<MergePhaseSelection>({
    day30_branch_id: branches[0]?.id || '',
    day60_branch_id: branches[0]?.id || '',
    day90_branch_id: branches[0]?.id || '',
    experiments_branch_id: branches[0]?.id || '',
  });
  const [viewMode, setViewMode] = useState<'slider' | 'table'>('slider');

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const handlePhaseSelection = (phase: keyof MergePhaseSelection, branchId: string) => {
    setSelectedPhases((prev) => ({
      ...prev,
      [phase]: branchId,
    }));
  };

  const handleMerge = () => {
    // Check if at least 2 branches are selected
    const uniqueBranches = new Set(Object.values(selectedPhases));
    if (uniqueBranches.size < 2) {
      alert('Please select phases from at least 2 different branches to create a meaningful merge.');
      return;
    }
    onMerge(selectedPhases);
  };

  const phaseKeyMap: Record<(typeof PHASES)[number], keyof MergePhaseSelection> = {
    day30: 'day30_branch_id',
    day60: 'day60_branch_id',
    day90: 'day90_branch_id',
  };

  const allPhasesSelected = PHASES.every(
    (phase) => {
      const key = phaseKeyMap[phase];
      return selectedPhases[key] && branches.find((b) => b.id === selectedPhases[key]);
    }
  );

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl max-w-7xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          Compare & Merge Roadmaps
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-2xl mx-auto mt-2">
          You've explored multiple strategic paths. Compare them side-by-side, then select the best approach for each phase to create a hybrid roadmap.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-bold text-blue-900 font-headline mb-1">
              How to Merge
            </div>
            <div className="text-sm text-blue-800/80 font-body">
              Select which branch to use for each phase (Day 30, 60, 90). You can pick different branches for different phases.
              For example: Use "Ship Fast" for Day 30 to validate quickly, then "Build Moat" for Day 60-90 to deepen defensibility.
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-headline">
            Compare Your Branches
          </h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={viewMode === 'slider' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('slider')}
              className={viewMode === 'slider' ? 'bg-primary text-white' : 'bg-white'}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Slider View
            </Button>
            <Button
              type="button"
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-primary text-white' : 'bg-white'}
            >
              <List className="w-4 h-4 mr-2" />
              Table View
            </Button>
          </div>
        </div>

        {/* Slider View */}
        {viewMode === 'slider' && (
          <BranchComparisonSlider
            branches={branches}
            onMergeRequest={(branchIds) => {
              if (branchIds.length === 1) {
                // Single branch selected - use it for all phases
                setSelectedPhases({
                  day30_branch_id: branchIds[0],
                  day60_branch_id: branchIds[0],
                  day90_branch_id: branchIds[0],
                  experiments_branch_id: branchIds[0],
                });
              }
            }}
          />
        )}

        {/* Phase Selection Table */}
        {viewMode === 'table' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-headline">
            Select Branch for Each Phase
          </h3>

          {PHASES.map((phase) => {
            const phaseKey = phaseKeyMap[phase];
            const selectedBranchId = selectedPhases[phaseKey];

            return (
            <div key={phase} className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-body">
                  {PHASE_LABELS[phase]}
                </h4>
                {selectedBranchId && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-white"
                    style={{
                      borderColor: branches.find((b) => b.id === selectedBranchId)?.color,
                    }}
                  >
                    {branches.find((b) => b.id === selectedBranchId)?.name}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {branches.map((branch) => {
                  const isSelected = selectedBranchId === branch.id;
                  const roadmap = branch.roadmap;
                  const phaseData = roadmap[phase];

                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => handlePhaseSelection(phaseKey, branch.id)}
                      disabled={isLoading}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: branch.color }}
                          />
                          <span className="text-sm font-medium text-[#1A1A1A] font-headline">
                            {branch.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-primary border-primary' : 'border-stone-300'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-[#1A1A1A]/60 font-body">
                          {phaseData.focus}
                        </div>
                        <div className="text-xs text-[#1A1A1A]/80 font-body line-clamp-2">
                          {phaseData.milestones.slice(0, 2).join(' • ')}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            );
          })}
        </div>
        )}

        {/* Merge Summary */}

        {/* Merge Summary */}
        {allPhasesSelected && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GitMerge className="w-5 h-5 text-green-600" />
              <h4 className="text-sm font-bold text-green-900 font-headline">
                Merge Preview
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {PHASES.map((phase) => {
                const phaseKey = phaseKeyMap[phase];
                const branch = branches.find((b) => b.id === selectedPhases[phaseKey]);
                return (
                  <div key={phase}>
                    <div className="text-xs text-green-700/70 font-body mb-1">
                      {PHASE_LABELS[phase].split(' ')[0]}
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: branch?.color }}
                      />
                      <span className="font-medium text-green-900">{branch?.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            type="button"
            onClick={handleMerge}
            disabled={isLoading || !allPhasesSelected}
            className="flex-1 sm:flex-none h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all px-8"
          >
            <GitMerge className="mr-2 h-4 w-4" />
            Merge & Create Hybrid Roadmap
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onBranchSelect(activeBranchId || branches[0]?.id || '')}
            disabled={isLoading}
            className="flex-1 sm:flex-none h-12 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-lg transition-all border-stone-300"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Continue with Single Branch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
