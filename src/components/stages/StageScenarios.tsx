"use client";

import { GenerateFounderScenariosOutput } from "@/ai/flows/scenario-persona-tool";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Target, EyeOff, Shield } from "lucide-react";

interface StageScenariosProps {
  scenarios?: GenerateFounderScenariosOutput;
  onNext: () => void;
  isLoading: boolean;
}

export default function StageScenarios({ scenarios, onNext, isLoading }: StageScenariosProps) {
  if (!scenarios) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-headline">Strategic Personas</h2>
        <p className="text-muted-foreground">Every project changes depending on who's building it. Here are three distinct ways to approach your idea.</p>
      </div>

      <div className="grid gap-6">
        {scenarios.scenarios.map((s, i) => (
          <Card key={i} className="border-border shadow-none overflow-hidden hover:border-primary/30 transition-colors">
            <CardHeader className="bg-secondary/20 pb-4">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <span className="text-primary">{i + 1}.</span> {s.scenarioName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-tighter">
                    <Shield className="w-3 h-3" />
                    Constraints
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.constraints}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-destructive font-medium text-xs uppercase tracking-tighter">
                    <EyeOff className="w-3 h-3" />
                    Blind Spots
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.blindSpots}</p>
                </div>
              </div>
              <div className="bg-[#FDFDFA] p-4 rounded border border-border/50">
                <div className="flex items-center gap-2 text-foreground font-medium text-xs uppercase tracking-tighter mb-2">
                  <Target className="w-3 h-3 text-primary" />
                  Definition of Success
                </div>
                <p className="text-sm font-medium italic">"{s.successDefinition}"</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={onNext} 
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Synthesizing Roadmap...
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