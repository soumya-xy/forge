"use client";

import { MilestonePlan } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface StageRoadmapProps {
  roadmap?: MilestonePlan;
  onNext: () => void;
  isLoading: boolean;
}

export default function StageRoadmap({ roadmap, onNext, isLoading }: StageRoadmapProps) {
  const [activeTab, setActiveTab] = useState<"30" | "60" | "90">("30");

  if (!roadmap) return null;

  const sections = [
    { id: "30" as const, label: "Day 30 — Validation", data: roadmap.day30 },
    { id: "60" as const, label: "Day 60 — Execution", data: roadmap.day60 },
    { id: "90" as const, label: "Day 90 — Optimization", data: roadmap.day90 },
  ];

  const currentSection = sections.find(s => s.id === activeTab)!;

  return (
    <div className="space-y-8 fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-headline text-[#1A1A1A]">Execution Roadmap</h2>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-body">
          A phased plan to turn your riskiest assumptions into empirical evidence. Select a phase to inspect.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex bg-[#EDEDEA] rounded-lg p-1">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all font-body
              ${activeTab === s.id 
                ? "bg-white text-primary shadow-sm" 
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
              }
            `}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="space-y-4">
        <Card className="border-none shadow-none bg-[#EDEDEA] rounded-xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-headline text-[#1A1A1A] font-semibold">
                  Focus: {currentSection.data.focus}
                </h3>
                <p className="text-xs text-[#1A1A1A]/50 mt-1 font-body">Day {activeTab === "30" ? "1-30" : activeTab === "60" ? "31-60" : "61-90"}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-[#1A1A1A]/5">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 font-body mb-3">Key Milestones</h4>
                  <ul className="space-y-3">
                    {currentSection.data.milestones.map((m, idx) => (
                      <li key={idx} className="text-sm text-[#1A1A1A] flex items-start gap-2.5 font-body leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 font-body mb-2">Assumption Tested</h4>
                  <span className="inline-block text-xs bg-white text-[#1A1A1A] px-3 py-1.5 rounded border border-[#border] font-body">
                    {currentSection.data.assumption}
                  </span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 font-body mb-2">Success Signal</h4>
                  <p className="text-sm font-headline italic font-medium text-primary">
                    ↳ {currentSection.data.success_signal}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4 border-t border-[#1A1A1A]/10 mt-12">
        <Button 
          onClick={onNext} 
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Gate Experiments...
            </>
          ) : (
            <>
              Enter the Experiment Gate
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}