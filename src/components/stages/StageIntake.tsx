"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface StageIntakeProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
  lastIdeaTitle?: string;
  onRestoreLastIdea?: () => void;
}

export default function StageIntake({ onSubmit, isLoading, lastIdeaTitle, onRestoreLastIdea }: StageIntakeProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length >= 10) {
      onSubmit(idea);
    }
  };

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          What are you building?
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-md mx-auto mt-2">
          Deconstruct your early-stage product or business idea. Share your vague thoughts, assumptions, or problem statements, and we will extract the friction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            placeholder="e.g. A marketplace for college students to rent out their dorm furniture over summer break..."
            className="min-h-[180px] text-base leading-relaxed bg-[#F8F6F2] border-[#border] focus-visible:ring-primary text-[#1A1A1A] font-body"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all"
            disabled={isLoading || idea.trim().length < 10}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Parsing Concept...
              </>
            ) : "Forge Concept"}
          </Button>
        </form>

        {lastIdeaTitle && onRestoreLastIdea && (
          <div className="pt-4 border-t border-[#1A1A1A]/10 text-center">
            <button
              onClick={onRestoreLastIdea}
              className="text-xs text-primary font-medium hover:underline focus:outline-none"
            >
              Your last idea: "{lastIdeaTitle}" (Click to restore)
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}