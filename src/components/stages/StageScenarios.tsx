"use client";

import { FounderScenarios } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Target, EyeOff, Shield } from "lucide-react";

interface StageScenariosProps {
  scenarios?: FounderScenarios;
  onNext: () => void;
  isLoading: boolean;
}

export default function StageScenarios({ scenarios, onNext, isLoading }: StageScenariosProps) {
  if (!scenarios) return null;

  return (
    <div className="space-y-8 fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-headline text-[#1A1A1A]">Strategic Personas</h2>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-body">
          Every project changes depending on who's building it. Here are three distinct pathways based on real-world founder profiles. Each represents a unique set of constraints and disadvantages.
        </p>
      </div>

      <div className="grid gap-6">
        {scenarios.scenarios.map((s, i) => (
          <Card key={i} className="border-none shadow-none bg-[#EDEDEA] overflow-hidden rounded-xl">
            <CardHeader className="bg-[#EDEDEA] pb-3 border-b border-[#1A1A1A]/5">
              <CardTitle className="text-xl font-headline flex items-center gap-2 text-[#1A1A1A]">
                <span className="text-primary">{i + 1}.</span> {s.scenarioName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-primary font-medium text-xs uppercase tracking-wider font-body">
                    <Shield className="w-3.5 h-3.5" />
                    Constraints & Disadvantages
                  </div>
                  <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-body">{s.constraints}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-primary/80 font-medium text-xs uppercase tracking-wider font-body">
                    <EyeOff className="w-3.5 h-3.5" />
                    Potential Blind Spots
                  </div>
                  <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-body">{s.blindSpots}</p>
                </div>
              </div>
              <div className="bg-[#F8F6F2] p-5 rounded-lg border border-[#border] flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-primary font-medium text-xs uppercase tracking-wider font-body mb-2">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  Definition of Success
                </div>
                <p className="text-sm font-headline italic font-medium text-[#1A1A1A] leading-relaxed">
                  "{s.successDefinition}"
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={onNext} 
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Synthesizing Execution Roadmap...
          </>
        ) : (
          <>
            Synthesize Execution Roadmap
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}