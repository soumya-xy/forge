"use client";

import { useState } from "react";
import {
  PostureSelection,
  PostureOption,
} from "@/types/types";
import { StrategicPosture } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Loader2,
  Rocket,
  Shield,
  Users,
  CheckCircle2,
  ArrowLeftRight,
  GitBranch,
} from "lucide-react";

interface StagePostureProps {
  postures?: PostureSelection;
  onConfirm: (chosen: PostureOption) => void;
  onBranchingMode?: () => void;
  isLoading: boolean;
}

const POSTURE_ICON: Record<StrategicPosture, React.ElementType> = {
  [StrategicPosture.SHIP_FAST]: Rocket,
  [StrategicPosture.BUILD_MOAT]: Shield,
  [StrategicPosture.COMMUNITY_FIRST]: Users,
};

export default function StagePosture({ postures, onConfirm, onBranchingMode, isLoading }: StagePostureProps) {
  const [selected, setSelected] = useState<PostureOption | null>(null);

  if (!postures) return null;

  return (
    <div className="space-y-8 fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-headline text-[#1A1A1A]">Strategic Posture</h2>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-body">
          Before execution, commit to an overall approach. These three postures are
          fundamentally different strategies — not stylistic variants. Pick the one
          you'll defend for the next 90 days.
        </p>
      </div>

      <div className="grid gap-5">
        {postures.options.map((p) => {
          const Icon = POSTURE_ICON[p.posture] ?? ArrowLeftRight;
          const isChosen = selected?.posture === p.posture;
          const isDimmed = selected !== null && !isChosen;
          return (
            <Card
              key={p.posture}
              onClick={() => !isLoading && setSelected(p)}
              className={`cursor-pointer transition-all border rounded-xl bg-white
                ${isChosen
                  ? "border-primary ring-2 ring-primary/40 shadow-md"
                  : "border-[#EDEDEA] hover:border-primary/40"
                }
                ${isDimmed ? "opacity-50" : ""}
              `}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline text-lg font-semibold text-[#1A1A1A]">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#1A1A1A]/65 font-body mt-0.5 uppercase tracking-wider">
                        {p.posture.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  {isChosen && (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>

                <p className="text-sm text-[#1A1A1A]/85 leading-relaxed font-body">
                  {p.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-[#1A1A1A]/5">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 font-body">
                      Best for
                    </div>
                    <p className="text-xs text-[#1A1A1A]/80 font-body leading-relaxed">
                      {p.bestFor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]/80 font-body">
                      Tradeoff
                    </div>
                    <p className="text-xs text-[#1A1A1A]/80 font-body leading-relaxed">
                      {p.tradeoff}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => selected && onConfirm(selected)}
          disabled={!selected || isLoading}
          className="flex-1 h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Synthesizing Execution Roadmap...
            </>
          ) : (
            <>
              {selected ? `Commit to "${selected.name}"` : "Select a posture"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {onBranchingMode && (
          <Button
            type="button"
            variant="outline"
            onClick={onBranchingMode}
            disabled={isLoading}
            className="flex-1 sm:flex-none h-12 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-lg transition-all border-stone-300"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Explore All (Branch Mode)
          </Button>
        )}
      </div>
    </div>
  );
}