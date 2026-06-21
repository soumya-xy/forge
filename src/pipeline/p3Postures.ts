'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p3PosturesPrompt } from '@/prompts/prompts';
import { IdeaJSON, RiskRegister, UserProfile, PostureSelection } from '@/types/types';
import { StrategicPosture } from '@/types/enums';

const PostureOptionSchema = z.object({
  posture: z.nativeEnum(StrategicPosture).describe('One of the three hardcoded posture enum values'),
  name: z.string().describe('2-4 word label'),
  description: z.string().describe('1-2 sentence framing for this idea'),
  bestFor: z.string().describe('1 sentence on why this fits the founder'),
  tradeoff: z.string().describe('1 sentence on what they give up'),
});

const PostureSelectionSchema = z.object({
  options: z.array(PostureOptionSchema).length(3).describe('Exactly 3 posture options, one per enum value'),
});

export async function runP3Postures(
  idea: IdeaJSON,
  risks: RiskRegister,
  profile?: UserProfile,
): Promise<PostureSelection> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  const riskRegisterStr = JSON.stringify(risks, null, 2);
  const prompt = p3PosturesPrompt(ideaJsonStr, riskRegisterStr, profile);
  return await callGemini<PostureSelection>({
    prompt,
    schema: PostureSelectionSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a startup strategist. Present 3 distinct strategic postures without softening the tradeoffs.',
  });
}