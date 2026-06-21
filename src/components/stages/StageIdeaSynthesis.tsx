"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import IdeaRelationshipMap from "@/components/ui/IdeaRelationshipMap";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  GitMerge,
  GitBranch,
  MessageSquare,
} from "lucide-react";
import { IdeaSynthesis } from "@/types/types";

interface StageIdeaSynthesisProps {
  synthesis: IdeaSynthesis;
  onMerge: () => void;
  onPursueSeparately: (selectedIndex: number) => void;
  isLoading?: boolean;
}

const RECOMMENDATION_CONFIG = {
  merge_as_one: {
    label: "Merge as One",
    description: "These ideas share a core bet. Pursue as a unified concept.",
    icon: GitMerge,
    color: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  pursue_separately: {
    label: "Pursue Separately",
    description: "These are fundamentally different. Pick one to focus on.",
    icon: GitBranch,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  conflicts_resolve_first: {
    label: "Resolve Conflicts First",
    description: "These ideas have contradictions. Address them before proceeding.",
    icon: AlertTriangle,
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
};

export default function StageIdeaSynthesis({
  synthesis,
  onMerge,
  onPursueSeparately,
  isLoading = false,
}: StageIdeaSynthesisProps) {
  const config = RECOMMENDATION_CONFIG[synthesis.analysis.recommendation];
  const RecommendationIcon = config.icon;

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl max-w-5xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          Idea Synthesis Analysis
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-md mx-auto mt-2">
          We've analyzed your ideas together to identify patterns, conflicts, and opportunities.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Visual Relationship Map */}
        <IdeaRelationshipMap
          ideas={synthesis.original_ideas.map(idea => idea.parsed)}
          analysis={synthesis.analysis}
        />

        {/* AI Recommendation */}
        <div className={`flex items-center gap-4 p-6 rounded-xl ${config.bgColor}`}>
          <div className={`p-3 rounded-full ${config.color}`}>
            <RecommendationIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className={`text-2xl font-bold ${config.textColor} font-headline`}>
              {config.label}
            </div>
            <div className={`text-sm ${config.textColor}/80 font-body mt-1`}>
              {config.description}
            </div>
          </div>
        </div>

        {/* Core Bet */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-headline flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Core Bet
          </h3>
          <div className="p-4 bg-white rounded-lg border border-stone-200">
            <p className="text-sm text-[#1A1A1A] font-body leading-relaxed">
              {synthesis.analysis.core_bet}
            </p>
          </div>
        </div>

        {/* Conflicts */}
        {synthesis.analysis.conflicts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1A1A1A] font-headline flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Conflicts Detected
            </h3>
            <div className="space-y-2">
              {synthesis.analysis.conflicts.map((conflict, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-[#1A1A1A]/80 font-body"
                >
                  "{conflict}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complementarity */}
        {synthesis.analysis.complementarity.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1A1A1A] font-headline flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              How Ideas Complement Each Other
            </h3>
            <div className="space-y-2">
              {synthesis.analysis.complementarity.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-[#1A1A1A]/80 font-body"
                >
                  "{comp}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Original Ideas Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-headline flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Original Ideas ({synthesis.original_ideas.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            {synthesis.original_ideas.map((idea, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-medium">
                    Idea {idx + 1}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A] font-headline mb-1">
                  {idea.parsed.title}
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 font-body line-clamp-3">
                  {idea.parsed.core_problem}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {synthesis.analysis.recommendation === "merge_as_one" && synthesis.analysis.unified_idea && (
            <Button
              type="button"
              onClick={onMerge}
              disabled={isLoading}
              className="flex-1 h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
            >
              <GitMerge className="mr-2 h-4 w-4" />
              Merge as One Idea
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {synthesis.analysis.recommendation === "pursue_separately" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {synthesis.original_ideas.map((idea, idx) => (
                <Button
                  key={idx}
                  type="button"
                  onClick={() => onPursueSeparately(idx)}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 h-12 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-lg transition-all border-stone-300"
                >
                  <GitBranch className="mr-2 h-4 w-4" />
                  Pursue Idea {idx + 1}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ))}
            </div>
          )}

          {synthesis.analysis.recommendation === "conflicts_resolve_first" && (
            <Button
              type="button"
              onClick={() => onPursueSeparately(0)}
              disabled={isLoading}
              variant="outline"
              className="h-12 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-lg transition-all border-stone-300"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Choose Idea 1 to Discuss
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
