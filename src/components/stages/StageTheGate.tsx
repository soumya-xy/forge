"use client";

import { MilestoneSchema } from "@/ai/flows/milestone-synthesis-tool";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";

interface StageTheGateProps {
  milestones?: any[];
  onSelect: (milestone: any) => void;
  isLoading: boolean;
}

export default function StageTheGate({ milestones, onSelect, isLoading }: StageTheGateProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!milestones || milestones.length === 0) return null;

  const experiments = milestones.slice(0, 3);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 max-w-[500px] mx-auto">
        <h2 className="text-3xl font-headline italic">The Experiment Gate</h2>
        <p className="text-muted-foreground">
          You cannot do everything at once. Execution requires focus. 
          Pick the single most critical experiment to run in the next 30 days.
        </p>
      </div>

      <div className="grid gap-6">
        {experiments.map((exp, i) => (
          <div 
            key={i}
            onClick={() => !isLoading && setSelectedIdx(i)}
            className={`
              cursor-pointer group relative p-6 bg-white border rounded-xl transition-all duration-300
              ${selectedIdx === i ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                ${selectedIdx === i ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
              `}>
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-2 pr-12">
                <h3 className="font-headline text-lg">{exp.milestone}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{exp.actions[0]}</p>
              </div>
            </div>
            {selectedIdx === i && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-widest">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <Button 
          onClick={() => selectedIdx !== null && onSelect(experiments[selectedIdx])}
          disabled={selectedIdx === null || isLoading}
          className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Mapping Resources...
            </>
          ) : (
            "Finalize My Choice & Get Resources"
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          This choice is final for this session. Choose wisely.
        </p>
      </div>
    </div>
  );
}