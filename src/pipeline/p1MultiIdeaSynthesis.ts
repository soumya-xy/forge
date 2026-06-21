'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p1MultiIdeaSynthesisPrompt } from '@/prompts/prompts';
import { IdeaJSON, IdeaSynthesis, IdeaWithInput } from '@/types/types';
import { runP1Intake } from './p1Intake';

const IdeaWithInputSchema = z.object({
  raw_input: z.string().describe('Original raw idea text'),
  parsed: z.any().describe('Parsed IdeaJSON (already validated by P1Intake)'),
});

const IdeaSynthesisAnalysisSchema = z.object({
  core_bet: z.string().describe('What all ideas have in common - the fundamental thesis'),
  conflicts: z.array(z.string()).describe('Specific contradictions between ideas'),
  complementarity: z.array(z.string()).describe('How ideas could complement each other'),
  recommendation: z.enum(['merge_as_one', 'pursue_separately', 'conflicts_resolve_first']).describe('AI recommendation'),
  unified_idea: z.any().optional().describe('If merge_as_one, the unified IdeaJSON'),
});

const IdeaSynthesisSchema = z.object({
  original_ideas: z.array(IdeaWithInputSchema).describe('All ideas with their parsed forms'),
  analysis: IdeaSynthesisAnalysisSchema.describe('Synthesis analysis'),
});

export async function runP1MultiIdeaSynthesis(
  raw_ideas: string[]
): Promise<IdeaSynthesis> {
  // Run P1 Intake in parallel for all ideas
  const parsedIdeas = await Promise.all(
    raw_ideas.map(async (idea) => {
      try {
        const parsed = await runP1Intake(idea);
        return { raw_input: idea, parsed };
      } catch (error) {
        console.error(`Failed to parse idea: ${idea}`, error);
        throw error;
      }
    })
  );

  // If only one idea, no synthesis needed
  if (parsedIdeas.length === 1) {
    return {
      original_ideas: parsedIdeas,
      analysis: {
        core_bet: "Single idea - no synthesis needed",
        conflicts: [],
        complementarity: [],
        recommendation: 'merge_as_one',
        unified_idea: parsedIdeas[0].parsed,
      },
      synthesized_at: new Date().toISOString(),
    };
  }

  // Run AI synthesis analysis
  const ideasJsonStr = JSON.stringify(parsedIdeas, null, 2);
  const prompt = p1MultiIdeaSynthesisPrompt(ideasJsonStr);

  const synthesis = await callGemini<z.infer<typeof IdeaSynthesisSchema>>({
    prompt,
    schema: IdeaSynthesisSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an expert startup strategist. Identify patterns, conflicts, and core themes across multiple business ideas.',
  });

  return {
    original_ideas: synthesis.original_ideas as IdeaWithInput[],
    analysis: synthesis.analysis,
    synthesized_at: new Date().toISOString(),
  };
}
