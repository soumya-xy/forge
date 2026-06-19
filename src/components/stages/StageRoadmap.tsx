"use client";

import { MilestoneSynthesisToolOutput } from "@/ai/flows/milestone-synthesis-tool";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface StageRoadmapProps {
  roadmap?: MilestoneSynthesisToolOutput;
  onNext: () => void;
}

export default function StageRoadmap({ roadmap, onNext }: StageRoadmapProps) {
  if (!roadmap) return null;

  const sections = [
    { id: "30", label: "Day 30", data: roadmap.day30 },
    { id: "60", label: "Day 60", data: roadmap.day60 },
    { id: "90", label: "Day 90", data: roadmap.day90 },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-headline">Execution Roadmap</h2>
        <p className="text-muted-foreground">A phased plan to turn your assumptions into evidence.</p>
      </div>

      <Tabs defaultValue="30" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/30 h-12 p-1">
          {sections.map(s => (
            <TabsTrigger key={s.id} value={s.id} className="data-[state=active]:bg-white data-[state=active]:text-primary font-medium">
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map(section => (
          <TabsContent key={section.id} value={section.id} className="mt-6 space-y-4">
            {section.data.map((m, i) => (
              <Card key={i} className="border-border shadow-none bg-white">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-0.5" />
                    <h3 className="text-lg font-headline text-foreground">{m.milestone}</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Key Actions</h4>
                        <ul className="space-y-2">
                          {m.actions.map((action, ai) => (
                            <li key={ai} className="text-sm flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Testing These Assumptions</h4>
                        <div className="flex flex-wrap gap-2">
                          {m.testableAssumptions.map((ass, si) => (
                            <span key={si} className="text-[11px] bg-secondary/50 px-2 py-1 rounded border border-border">
                              {ass}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Success Signals</h4>
                        <ul className="space-y-2">
                          {m.successSignals.map((sig, ssi) => (
                            <li key={ssi} className="text-sm text-primary italic">
                              ↳ {sig}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4 border-t border-border mt-12">
        <Button 
          onClick={onNext} 
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Enter the Experiment Gate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}