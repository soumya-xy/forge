"use client";

import { useState } from "react";
import { ResourceItem, IdeaJSON, CandidateExperiment, MilestonePlan, MicroActionDraft } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, RefreshCw, Bookmark, Calendar, Compass, Layers, Copy, Check, Sparkles } from "lucide-react";

interface StageResourcesProps {
  idea?: IdeaJSON;
  chosenExperiment?: CandidateExperiment;
  roadmap?: MilestonePlan;
  matched?: ResourceItem[];
  draft?: MicroActionDraft;
  onReset: () => void;
}

export default function StageResources({ idea, chosenExperiment, roadmap, matched, draft, onReset }: StageResourcesProps) {
  const [copied, setCopied] = useState(false);

  if (!idea || !chosenExperiment || !roadmap || !matched) return null;

  // Group by category
  const categories = Array.from(new Set(matched.map(r => r.category)));

  // Nice category names
  const getCategoryLabel = (cat: string) => {
    return cat.replace(/_/g, ' ');
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.draft_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 fade-in">
      {/* Top Concept Card */}
      <div className="p-8 bg-[#EDEDEA] rounded-xl text-center space-y-4 border border-stone-300/30">
        <h2 className="text-4xl font-headline tracking-tight text-[#1A1A1A]">
          {idea.title}
        </h2>
        <div className="w-12 h-1 bg-primary mx-auto my-3" />
        <p className="text-sm text-[#1A1A1A]/80 font-body max-w-lg mx-auto leading-relaxed">
          Your chosen bet for Week 1-2: <span className="font-semibold text-primary">"{chosenExperiment.name}"</span>. 
          Hypothesis: "{chosenExperiment.hypothesis}"
        </p>
      </div>

      {/* Middle Milestone Cards (Horizontal on Desktop) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/50 font-body">
          30/60/90 Day Execution Roadmap
        </h3>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Day 30 */}
          <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Compass className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest font-body">Day 30 — Validation</h4>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A] font-body leading-snug">
                Focus: {roadmap.day30.focus}
              </p>
              <ul className="space-y-2">
                {roadmap.day30.milestones.map((m, idx) => (
                  <li key={idx} className="text-xs text-[#1A1A1A]/95 leading-relaxed font-body list-disc pl-1 ml-4">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-[#1A1A1A]/5 space-y-2">
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase font-semibold font-body">
                (assumption being tested)
              </div>
              <p className="text-xs text-[#1A1A1A]/80 font-body italic leading-normal">
                "{roadmap.day30.assumption}"
              </p>
            </div>
          </Card>

          {/* Day 60 */}
          <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Layers className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest font-body">Day 60 — Execution</h4>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A] font-body leading-snug">
                Focus: {roadmap.day60.focus}
              </p>
              <ul className="space-y-2">
                {roadmap.day60.milestones.map((m, idx) => (
                  <li key={idx} className="text-xs text-[#1A1A1A]/95 leading-relaxed font-body list-disc pl-1 ml-4">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-[#1A1A1A]/5 space-y-2">
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase font-semibold font-body">
                (assumption being tested)
              </div>
              <p className="text-xs text-[#1A1A1A]/80 font-body italic leading-normal">
                "{roadmap.day60.assumption}"
              </p>
            </div>
          </Card>

          {/* Day 90 */}
          <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest font-body">Day 90 — Optimization</h4>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A] font-body leading-snug">
                Focus: {roadmap.day90.focus}
              </p>
              <ul className="space-y-2">
                {roadmap.day90.milestones.map((m, idx) => (
                  <li key={idx} className="text-xs text-[#1A1A1A]/95 leading-relaxed font-body list-disc pl-1 ml-4">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-[#1A1A1A]/5 space-y-2">
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase font-semibold font-body">
                (assumption being tested)
              </div>
              <p className="text-xs text-[#1A1A1A]/80 font-body italic leading-normal">
                "{roadmap.day90.assumption}"
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* The "First Real Step" Micro-Action Section */}
      {draft && (
        <div className="p-6 bg-gradient-to-br from-stone-50 to-[#EDEDEA]/40 border-2 border-primary/20 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-headline text-lg font-bold text-[#1A1A1A]">
                First Real Step: outreach script & tools
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full font-body">
              {draft.draft_type}
            </span>
          </div>

          <p className="text-xs text-[#1A1A1A]/70 font-body leading-relaxed">
            Move from planning to execution immediately. Copy this custom-generated draft to reach out to users, pitch early, or build validation structures.
          </p>

          <div className="relative">
            <div className="bg-white border border-stone-200 rounded-lg p-5 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto select-all shadow-inner">
              {draft.draft_content}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 bg-[#EDEDEA] hover:bg-stone-200 border border-stone-300 text-[#1A1A1A]/70 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1.5 text-[10px] font-bold uppercase font-body"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-sage" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Resource Panel */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/50 font-body">
            Resource Panel
          </h3>
          <p className="text-xs text-[#1A1A1A]/60 font-body mt-1">
            These are starting points, not endorsements.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map(cat => (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full font-body">
                  {getCategoryLabel(cat)}
                </span>
                <div className="flex-1 h-[1px] bg-stone-300" />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {matched.filter(r => r.category === cat).map(resource => (
                  <a 
                    key={resource.id} 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <Card className="h-full border border-stone-200 shadow-none hover:border-primary/50 transition-all rounded-lg p-5 bg-white">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-sm font-headline font-semibold text-[#1A1A1A] group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {resource.name}
                          </h4>
                          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-body">
                            {resource.description}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {resource.tags.map(t => (
                            <span key={t} className="text-[9px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-500 font-body uppercase">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uncertainty Disclaimer & Print/Reset Actions */}
      <div className="pt-10 border-t border-[#1A1A1A]/10 flex flex-col items-center gap-6">
        <p className="text-xs text-center text-[#1A1A1A]/60 max-w-lg italic font-body">
          "This plan reflects one possible path. Circumstances change. Revisit your assumptions at each milestone."
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onReset} className="border-stone-300 hover:bg-[#EDEDEA] flex items-center gap-2 font-body text-sm">
            <RefreshCw className="w-4 h-4" />
            Start New Project
          </Button>
          <Button variant="default" className="bg-primary hover:bg-primary/95 flex items-center gap-2 font-body text-sm text-white" onClick={() => window.print()}>
            <Bookmark className="w-4 h-4" />
            Export Plan (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}