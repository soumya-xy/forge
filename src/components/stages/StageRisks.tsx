"use client";

import { IdeaJSON, RiskRegister } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { RiskLevel } from "@/types/enums";

interface StageRisksProps {
  idea?: IdeaJSON;
  risks?: RiskRegister;
  onNext: () => void;
  isLoading: boolean;
}

export default function StageRisks({ idea, risks, onNext, isLoading }: StageRisksProps) {
  if (!idea || !risks) return null;

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH:
        return "bg-destructive text-white";
      case RiskLevel.MEDIUM:
        return "bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/35";
      case RiskLevel.LOW:
        return "bg-[#6B8F71]/20 text-[#6B8F71] border border-[#6B8F71]/35";
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-headline text-[#1A1A1A]">{idea.title}</h2>
          <Badge variant="outline" className="border-[#C1440E] text-primary capitalize font-medium px-2 py-0.5">
            {idea.domain} (Scope: {idea.ambition_level}/5)
          </Badge>
        </div>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-body">
          We have deconstructed your idea. Below are the core parameters we identified.
        </p>
      </div>

      {/* Idea Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-5 bg-[#EDEDEA] rounded-lg space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50 font-body">Core Problem</h4>
          <p className="text-sm text-[#1A1A1A] leading-relaxed">{idea.core_problem}</p>
        </div>
        <div className="p-5 bg-[#EDEDEA] rounded-lg space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50 font-body">Target User</h4>
          <p className="text-sm text-[#1A1A1A] leading-relaxed">{idea.target_user}</p>
        </div>
        <div className="p-5 bg-[#EDEDEA] rounded-lg space-y-2 sm:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50 font-body">Key Assumption</h4>
          <p className="text-sm text-[#1A1A1A] leading-relaxed font-medium italic">"{idea.key_assumption}"</p>
        </div>
      </div>

      {/* Risk Register Section */}
      <section className="p-6 bg-[#FEF3C7]/40 border border-[#D97706]/20 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D97706]" />
          <h3 className="font-headline text-lg text-[#D97706]">12-Month Pre-Mortem Analysis</h3>
        </div>
        <p className="text-xs text-[#1A1A1A]/70 font-body leading-relaxed">
          <strong>Behavioral Retrospective:</strong> We assume your project has completely collapsed 12 months from now. Working backwards, here is the autopsy of the core friction points that caused the failure.
        </p>

        <div className="space-y-3 pt-2">
          {risks.map((risk, i) => (
            <div key={i} className="p-4 bg-white border border-[#EDEDEA] rounded-lg space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-headline text-sm font-semibold text-[#1A1A1A]">{risk.risk_name}</span>
                <div className="flex gap-1.5 text-[10px]">
                  <Badge variant="outline" className="border-stone-300 text-stone-600 font-normal py-0 px-2 uppercase">
                    {risk.category}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${getRiskLevelColor(risk.likelihood)}`}>
                    L: {risk.likelihood}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${getRiskLevelColor(risk.impact)}`}>
                    I: {risk.impact}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-body">{risk.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Button 
        onClick={onNext} 
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Strategic Personas...
          </>
        ) : (
          <>
            Generate Strategic Personas
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
