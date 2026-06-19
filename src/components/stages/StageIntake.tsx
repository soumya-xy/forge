"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface StageIntakeProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export default function StageIntake({ onSubmit, isLoading }: StageIntakeProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length > 10) {
      onSubmit(idea);
    }
  };

  return (
    <Card className="border-none shadow-sm bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">What are you building?</CardTitle>
        <CardDescription>
          Don't worry about being perfect. Just dump your thoughts here.
          We'll help you find the edges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            placeholder="e.g. A marketplace for college students to rent out their dorm furniture over summer break..."
            className="min-h-[200px] text-lg leading-relaxed bg-[#FDFDFA] border-border"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 transition-all text-white font-medium"
            disabled={isLoading || idea.trim().length < 10}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing Idea...
              </>
            ) : "Forge Initial Concept"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}