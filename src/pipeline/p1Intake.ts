'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p1IntakePrompt } from '@/prompts/prompts';
import { IdeaJSON } from '@/types/types';

const IdeaJSONSchema = z.object({
  title: z.string().describe('Concise catchy name'),
  core_problem: z.string().describe('The fundamental problem'),
  target_user: z.string().describe('Primary target user profile'),
  key_assumption: z.string().describe('Critical unproven assumption'),
  ambition_level: z.number().min(1).max(5).describe('Ambition level from 1 to 5'),
  domain: z.string().describe('Project domain'),
});

export async function runP1Intake(idea: string): Promise<IdeaJSON> {
  const prompt = p1IntakePrompt(idea);
  return await callGemini<IdeaJSON>({
    prompt,
    schema: IdeaJSONSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a analytical, skeptical product advisor. Deconstruct ideas objectively.',
  });
}
