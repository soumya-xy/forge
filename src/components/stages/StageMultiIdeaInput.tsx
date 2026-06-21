"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Plus, X, Lightbulb } from "lucide-react";

interface StageMultiIdeaInputProps {
  onSubmit: (ideas: string[]) => void;
  isLoading?: boolean;
}

const MAX_IDEAS = 3;
const MIN_IDEAS = 1;
const MIN_CHARS = 10;

export default function StageMultiIdeaInput({
  onSubmit,
  isLoading = false,
}: StageMultiIdeaInputProps) {
  const [ideas, setIdeas] = useState<string[]>([""]);

  const updateIdea = (index: number, value: string) => {
    const newIdeas = [...ideas];
    newIdeas[index] = value;
    setIdeas(newIdeas);
  };

  const addIdea = () => {
    if (ideas.length < MAX_IDEAS) {
      setIdeas([...ideas, ""]);
    }
  };

  const removeIdea = (index: number) => {
    if (ideas.length > MIN_IDEAS) {
      setIdeas(ideas.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const validIdeas = ideas.filter((idea) => idea.trim().length >= MIN_CHARS);
    if (validIdeas.length >= MIN_IDEAS) {
      onSubmit(validIdeas);
    }
  };

  const isValidCount = ideas.filter((idea) => idea.trim().length >= MIN_CHARS).length >= MIN_IDEAS;
  const canAddMore = ideas.length < MAX_IDEAS;
  const canRemove = ideas.length > MIN_IDEAS;

  return (
    <Card className="border-none shadow-none bg-[#EDEDEA] p-6 rounded-xl max-w-3xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-headline tracking-tight text-[#1A1A1A]">
          What are you considering?
        </CardTitle>
        <CardDescription className="text-sm text-[#1A1A1A]/70 font-body max-w-md mx-auto mt-2">
          You can enter up to 3 startup ideas. We'll analyze them together to find patterns, conflicts, and
          complementarities.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {ideas.map((idea, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`idea-${index}`}
                  className="text-sm font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-body flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Idea {index + 1} of {MAX_IDEAS}
                </label>
                {canRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIdea(index)}
                    disabled={isLoading}
                    className="h-7 px-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <Textarea
                id={`idea-${index}`}
                value={idea}
                onChange={(e) => updateIdea(index, e.target.value)}
                disabled={isLoading}
                placeholder="Describe your startup idea in a few sentences..."
                className="min-h-[120px] resize-y bg-white border-[#EDEDEA] focus:border-primary focus:ring-primary/20"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[#1A1A1A]/50 font-body">
                  {idea.length < MIN_CHARS
                    ? `${MIN_CHARS - idea.length} more characters needed`
                    : "Ready to analyze"}
                </span>
                <span className="text-xs text-[#1A1A1A]/50 font-body">
                  {idea.length} / 2000
                </span>
              </div>
            </div>
          ))}

          {canAddMore && (
            <Button
              type="button"
              variant="outline"
              onClick={addIdea}
              disabled={isLoading}
              className="w-full border-dashed border-2 border-stone-300 hover:border-primary hover:bg-primary/5 text-stone-600 hover:text-primary transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Idea (optional)
            </Button>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !isValidCount}
            className="h-12 bg-primary hover:bg-primary/95 text-white font-medium rounded-lg transition-all px-8"
          >
            {isValidCount ? "Analyze Ideas" : "Enter at least 10 characters"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
