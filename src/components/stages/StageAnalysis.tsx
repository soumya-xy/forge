"use client";

import { IdeaIntakeParserOutput } from "@/ai/flows/idea-intake-parser";
import { AutomatedRiskRegisterOutput } from "@/ai/flows/automated-risk-register";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

interface StageAnalysisProps {
  data?: IdeaIntakeParserOutput;
  risks?: AutomatedRiskRegisterOutput;
  onNext: () => void;
  isLoading: boolean;
}

export default function StageAnalysis({ data, risks, onNext, isLoading }: StageAnalysisProps) {
  if (!data || !risks) return null;

  return (
    <div className="space-y-8 max-w-[680px]">
      <div className="space-y-4">
        <h2 className="text-2xl font-headline">Concept Deconstruction</h2>
        <p className="text-muted-foreground">We've broken down your idea into its core functional units.</p>
      </div>

      <div className="grid gap-6">
        <section className="p-6 bg-white border border-border rounded-lg space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Core Problems</h3>
          <ul className="space-y-3">
            {data.coreProblems.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">{i + 1}</span>
                <p className="text-sm leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 bg-white border border-border rounded-lg space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Key Assumptions</h3>
          <div className="flex flex-wrap gap-2">
            {data.keyAssumptions.map((a, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/50 text-foreground font-normal py-1 px-3">
                {a}
              </Badge>
            ))}
          </div>
        </section>

        <section className="p-6 bg-[#FEF2F2]/50 border border-destructive/20 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-sm uppercase tracking-wider text-destructive">Critical Risks Identified</h3>
          </div>
          <ScrollArea className="h-auto">
            <div className="space-y-3">
              {risks.map((risk, i) => (
                <div key={i} className="flex gap-4 p-3 bg-white border border-destructive/10 rounded-md">
                  <Badge variant="destructive" className="bg-destructive hover:bg-destructive uppercase text-[10px] h-5 mt-0.5">
                    {risk.category}
                  </Badge>
                  <p className="text-sm text-foreground/80">{risk.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      </div>

      <Button 
        onClick={onNext} 
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Scenarios...
          </>
        ) : (
          <>
            Generate Strategic Pathways
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}