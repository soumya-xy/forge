"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, User, Clock, Target, SkipForward } from "lucide-react";
import {
  UserRole,
  WeeklyHours,
  PrimaryGoal,
} from "@/types/enums";
import type { UserProfile } from "@/types/types";

interface StageProfileProps {
  onSubmit: (profiles: UserProfile[]) => void;
  isLoading: boolean;
}

const ROLE_OPTIONS: { value: UserRole; label: string; hint: string }[] = [
  { value: UserRole.STUDENT, label: "Student", hint: "Coursework, placements, or thesis-driven" },
  { value: UserRole.EMPLOYED, label: "Employed full-time", hint: "Day job with evenings/weekends free" },
  { value: UserRole.BETWEEN_JOBS, label: "Between jobs / freelance", hint: "Open calendar but no steady income" },
  { value: UserRole.FOUNDER, label: "Existing founder", hint: "Already running something; this is the next bet" },
];

const HOURS_OPTIONS: { value: WeeklyHours; label: string }[] = [
  { value: WeeklyHours.HRS_1_TO_5, label: "1-5 hrs/wk" },
  { value: WeeklyHours.HRS_5_TO_10, label: "5-10 hrs/wk" },
  { value: WeeklyHours.HRS_10_TO_20, label: "10-20 hrs/wk" },
  { value: WeeklyHours.HRS_20_PLUS, label: "20+ hrs/wk" },
];

const GOAL_OPTIONS: { value: PrimaryGoal; label: string }[] = [
  { value: PrimaryGoal.INCOME, label: "Generate income" },
  { value: PrimaryGoal.LEARNING, label: "Learn a new skill / domain" },
  { value: PrimaryGoal.PORTFOLIO, label: "Build portfolio / credibility" },
  { value: PrimaryGoal.IMPACT, label: "Create impact" },
  { value: PrimaryGoal.EXIT, label: "Build toward a fundable exit" },
];

function RadioRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`text-left p-3 rounded-lg border transition-all bg-white
              ${selected
                ? "border-primary ring-1 ring-primary/40 bg-primary/5"
                : "border-[#EDEDEA] hover:border-primary/40 hover:bg-primary/[0.02]"
              }`}
          >
            <div className="text-sm font-medium text-[#1A1A1A] font-body">{opt.label}</div>
            {opt.hint && (
              <div className="text-[11px] text-[#1A1A1A]/60 mt-0.5 font-body leading-snug">{opt.hint}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function StageProfile({ onSubmit, isLoading }: StageProfileProps) {
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [hours, setHours] = useState<WeeklyHours | undefined>(undefined);
  const [goal, setGoal] = useState<PrimaryGoal | undefined>(undefined);

  const handleSubmit = () => {
    onSubmit([{ role, hours, goal }]);
  };

  const handleSkip = () => {
    onSubmit([]);
  };

  const filledCount = [role, hours, goal].filter(Boolean).length;

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          Tell us about you
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-md mx-auto mt-2">
          Three quick questions so we can sharpen the plan around your real constraints. Everything is optional — skip if you'd rather.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#1A1A1A]/70">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest font-body">Where are you, right now?</h3>
          </div>
          <RadioRow options={ROLE_OPTIONS} value={role} onChange={setRole} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#1A1A1A]/70">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest font-body">How much time can you give this, weekly?</h3>
          </div>
          <RadioRow options={HOURS_OPTIONS} value={hours} onChange={setHours} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#1A1A1A]/70">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest font-body">What does success look like?</h3>
          </div>
          <RadioRow options={GOAL_OPTIONS} value={goal} onChange={setGoal} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || filledCount === 0}
            className="flex-1 h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
          >
            {filledCount === 0 ? "Pick at least one" : `Continue (${filledCount}/3)`}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isLoading}
            className="h-12 border-stone-300 hover:bg-stone-200/50 font-body text-stone-700 px-6"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}