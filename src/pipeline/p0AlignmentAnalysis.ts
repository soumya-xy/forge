'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p0AlignmentPrompt } from '@/prompts/prompts';
import { UserProfile, AlignmentAnalysis } from '@/types/types';
import { AlignmentScore, StrategicPosture } from '@/types/enums';

const ConflictItemSchema = z.object({
  type: z.enum(['posture', 'time', 'goal', 'exit']).describe('Type of conflict'),
  founders: z.array(z.string()).min(2).describe('Founder identifiers (e.g. "Founder A", "Founder B")'),
  description: z.string().describe('Clear explanation of the conflict'),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('How severe this conflict is'),
});

const AlignmentSuggestionsSchema = z.object({
  compromise_posture: z.object({
    posture: z.nativeEnum(StrategicPosture).describe('StrategicPosture enum value'),
    name: z.string().describe('2-4 word label'),
    description: z.string().describe('1-2 sentence framing'),
    bestFor: z.string().describe('1 sentence why this fit'),
    tradeoff: z.string().describe('1 sentence what they give up'),
  }).optional().describe('Suggested compromise posture'),
  phase_split: z.array(z.object({
    phase: z.string().describe('Which phase this founder leads'),
    lead_founder: z.string().describe('Which founder takes the lead'),
  })).optional().describe('Split phases between founders'),
  conversation_starters: z.array(z.string()).describe('Discussion prompts to resolve conflicts'),
});

const AlignmentAnalysisSchema = z.object({
  alignment_score: z.nativeEnum(AlignmentScore).describe('Overall alignment: LOW, MEDIUM, or HIGH'),
  conflicts: z.array(ConflictItemSchema).describe('Array of detected conflicts'),
  suggestions: AlignmentSuggestionsSchema.describe('Suggestions to resolve conflicts'),
});

export async function runP0AlignmentAnalysis(
  profiles: UserProfile[]
): Promise<AlignmentAnalysis> {
  if (profiles.length < 2) {
    // Single founder or empty - no alignment analysis needed
    return {
      alignment_score: 'HIGH',
      conflicts: [],
      suggestions: {
        conversation_starters: [],
      },
      analyzed_at: new Date().toISOString(),
    };
  }

  const profilesJsonStr = JSON.stringify(profiles, null, 2);
  const prompt = p0AlignmentPrompt(profilesJsonStr);

  const analysis = await callGemini<{
    alignment_score: AlignmentScore;
    conflicts: z.infer<typeof ConflictItemSchema>[];
    suggestions: z.infer<typeof AlignmentSuggestionsSchema>;
  }>({
    prompt,
    schema: AlignmentAnalysisSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an expert startup advisor specializing in team dynamics and founder alignment. Identify real conflicts that could derail startups.',
  });

  return {
    ...analysis,
    analyzed_at: new Date().toISOString(),
  };
}
