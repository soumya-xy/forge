"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { AlignmentAnalysis } from "@/types/types";
import { AlignmentScore } from "@/types/enums";

interface StageAlignmentReportProps {
  alignment: AlignmentAnalysis;
  onContinue: () => void;
  isLoading?: boolean;
}

const SCORE_CONFIG = {
  [AlignmentScore.LOW]: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: AlertTriangle,
    label: "Low Alignment",
    description: "Multiple serious conflicts detected. Discuss before proceeding.",
  },
  [AlignmentScore.MEDIUM]: {
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: AlertTriangle,
    label: "Medium Alignment",
    description: "Some conflicts exist. Review conversation starters below.",
  },
  [AlignmentScore.HIGH]: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    icon: CheckCircle2,
    label: "High Alignment",
    description: "Well-aligned team. Minor or no conflicts detected.",
  },
};

const SEVERITY_CONFIG = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function StageAlignmentReport({
  alignment,
  onContinue,
  isLoading = false,
}: StageAlignmentReportProps) {
  const scoreConfig = SCORE_CONFIG[alignment.alignment_score];
  const ScoreIcon = scoreConfig.icon;

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl max-w-4xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          Cofounder Alignment Analysis
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-md mx-auto mt-2">
          We've analyzed your team for potential conflicts. Review the findings before proceeding.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alignment Score Badge */}
        <div className={`flex items-center justify-center gap-3 p-6 rounded-xl ${scoreConfig.bgColor}`}>
          <div className={`p-3 rounded-full ${scoreConfig.color}`}>
            <ScoreIcon className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${scoreConfig.textColor} font-headline`}>
              {scoreConfig.label}
            </div>
            <div className={`text-sm ${scoreConfig.textColor}/80 font-body mt-1`}>
              {scoreConfig.description}
            </div>
          </div>
        </div>

        {/* Conflicts Section */}
        {alignment.conflicts.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1A1A1A] font-headline flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Detected Conflicts ({alignment.conflicts.length})
            </h3>
            <div className="space-y-3">
              {alignment.conflicts.map((conflict, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-lg border border-stone-200 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${SEVERITY_CONFIG[conflict.severity]}`}
                        >
                          {conflict.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium">
                          {conflict.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#1A1A1A] font-body leading-relaxed">
                        {conflict.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {conflict.founders.map((founder) => (
                          <span
                            key={founder}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-body"
                          >
                            {founder}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium font-body">No conflicts detected!</span>
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {(alignment.suggestions.compromise_posture ||
          alignment.suggestions.phase_split ||
          alignment.suggestions.conversation_starters.length > 0) && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1A1A1A] font-headline flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Recommendations & Discussion
            </h3>

            {alignment.suggestions.compromise_posture && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="text-sm font-bold text-primary font-headline mb-2">
                  Suggested Compromise Posture
                </div>
                <div className="text-sm text-[#1A1A1A] font-body">
                  <div className="font-medium">{alignment.suggestions.compromise_posture.name}</div>
                  <div className="mt-1 text-[#1A1A1A]/70">{alignment.suggestions.compromise_posture.description}</div>
                  <div className="mt-2 text-[#1A1A1A]/60 italic">
                    Best for: {alignment.suggestions.compromise_posture.bestFor}
                  </div>
                  <div className="mt-1 text-[#1A1A1A]/60 italic">
                    Trade-off: {alignment.suggestions.compromise_posture.tradeoff}
                  </div>
                </div>
              </div>
            )}

            {alignment.suggestions.phase_split && alignment.suggestions.phase_split.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-bold text-blue-700 font-headline mb-2">
                  Phase-by-Phase Leadership
                </div>
                <div className="space-y-1">
                  {alignment.suggestions.phase_split.map((split, idx) => (
                    <div key={idx} className="text-sm text-[#1A1A1A] font-body">
                      <span className="font-medium">{split.phase}:</span> led by{" "}
                      <span className="font-medium text-blue-700">{split.lead_founder}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alignment.suggestions.conversation_starters.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-bold text-[#1A1A1A] font-headline">
                  Conversation Starters
                </div>
                <div className="space-y-2">
                  {alignment.suggestions.conversation_starters.map((starter, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-stone-200 rounded-lg text-sm text-[#1A1A1A]/80 font-body italic"
                    >
                      "{starter}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            onClick={onContinue}
            disabled={isLoading}
            className="h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all px-8"
          >
            Acknowledge & Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
