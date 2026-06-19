"use client";

import { CandidateExperiment } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { EffortLevel, ExperimentRiskLevel } from "@/types/enums";

interface StageTheGateProps {
  experiments: CandidateExperiment[];
  onSelect: (experiment: CandidateExperiment) => void;
  isLoading: boolean;
}

export default function StageTheGate({ experiments, onSelect, isLoading }: StageTheGateProps) {
  const [selectedExperiment, setSelectedExperiment] = useState<CandidateExperiment | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getEffortColor = (level: EffortLevel) => {
    switch (level) {
      case EffortLevel.LOW:
        return "bg-[#6B8F71]/20 text-[#6B8F71] border border-[#6B8F71]/35";
      case EffortLevel.MEDIUM:
        return "bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/35";
      case EffortLevel.HIGH:
        return "bg-destructive text-white";
    }
  };

  const getRiskColor = (level: ExperimentRiskLevel) => {
    switch (level) {
      case ExperimentRiskLevel.LOW:
        return "bg-[#6B8F71]/20 text-[#6B8F71] border border-[#6B8F71]/35";
      case ExperimentRiskLevel.MEDIUM:
        return "bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/35";
      case ExperimentRiskLevel.HIGH:
        return "bg-destructive text-white";
    }
  };

  const handleCardClick = (exp: CandidateExperiment) => {
    if (isLoading) return;
    setSelectedExperiment(exp);
  };

  const handleConfirmSelect = () => {
    if (selectedExperiment) {
      onSelect(selectedExperiment);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="space-y-10 fade-in relative">
      <div className="text-center space-y-4 max-w-[540px] mx-auto">
        <h2 className="text-3xl font-headline tracking-tight text-[#1A1A1A]">The P5 Gate</h2>
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-body">
          You cannot test everything. True execution requires focus. Review these three candidate bets for your first 1-2 weeks, and commit to <strong>ONE</strong> path.
        </p>
      </div>

      {/* 3 Experiment Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {experiments.map((exp, i) => {
          const isChosen = selectedExperiment?.name === exp.name;
          const isAnySelected = selectedExperiment !== null;
          const isDimmed = isAnySelected && !isChosen;

          return (
            <div
              key={i}
              onClick={() => handleCardClick(exp)}
              className={`
                flex flex-col justify-between p-6 bg-white border rounded-xl transition-all duration-300 relative cursor-pointer
                ${isChosen 
                  ? 'ring-2 ring-primary border-primary shadow-md scale-[1.02] z-10' 
                  : 'border-[#border] hover:border-primary/50'
                }
                ${isDimmed ? 'opacity-40 filter grayscale-[20%]' : ''}
              `}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-headline text-lg font-semibold text-[#1A1A1A] leading-tight">
                    {exp.name}
                  </h3>
                  {isDimmed && (
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/40 border-stone-200">
                      Path Not Taken
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-body">
                  <span className="font-semibold text-primary">Hypothesis:</span> {exp.hypothesis}
                </p>

                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-body">
                  <span className="font-semibold text-stone-700">What you'll learn:</span> {exp.learn}
                </p>

                {/* Quantified Uncertainty & Confidence Gauges */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-body text-[#1A1A1A]/75">
                    <span className="font-semibold text-stone-600">Confidence Score:</span>
                    <span className="font-bold text-primary">{exp.confidence_score}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${exp.confidence_score}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-tight">
                    {exp.uncertainty_rating}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#1A1A1A]/5 flex flex-wrap gap-1.5 justify-between items-center">
                <div className="flex gap-1.5 text-[9px]">
                  <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-tight ${getEffortColor(exp.effort)}`}>
                    Effort: {exp.effort}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-tight ${getRiskColor(exp.risk)}`}>
                    Risk: {exp.risk}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExperiment(exp);
                    setShowConfirmModal(true);
                  }}
                  className={`text-xs font-semibold uppercase tracking-wider font-body hover:underline focus:outline-none transition-all
                    ${isChosen ? 'text-primary' : 'text-[#1A1A1A]/60'}
                  `}
                >
                  Select path →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsible AI Callout Box */}
      <div className="p-5 bg-[#EDEDEA] rounded-xl border border-stone-300/40 flex items-start gap-3.5 max-w-xl mx-auto">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] font-body">Why we don't choose for you</h4>
          <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-body">
            High-stakes early decisions depend on your context, constraints, and risk tolerance. We surface the options — you make the call.
          </p>
        </div>
      </div>

      {/* Main Trigger Button */}
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <Button 
          onClick={() => setShowConfirmModal(true)}
          disabled={!selectedExperiment || isLoading}
          className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg text-base transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Retracing Resources...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Commit to this path & Map Resources
            </>
          )}
        </Button>
        <p className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-widest font-body">
          This choice is yours. We won't make it for you.
        </p>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && selectedExperiment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F8F6F2] rounded-xl border border-stone-300 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <h3 className="font-headline text-2xl text-[#1A1A1A] font-semibold">Confirm Your Commitment</h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-body">
                You've chosen <strong>"{selectedExperiment.name}"</strong>. This shapes everything that follows. Continue?
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-[#1A1A1A]/10">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="border-stone-300 text-stone-700 hover:bg-[#EDEDEA] font-body text-sm"
              >
                Go Back
              </Button>
              <Button
                onClick={handleConfirmSelect}
                className="bg-primary hover:bg-primary/95 text-white font-body text-sm px-5"
              >
                Confirm Path
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}