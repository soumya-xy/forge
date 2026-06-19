'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p2RisksPrompt } from '@/prompts/prompts';
import { IdeaJSON, RiskRegister } from '@/types/types';
import { RiskCategory, RiskLevel } from '@/types/enums';

const RiskItemSchema = z.object({
  risk_name: z.string().describe('Short name of the risk'),
  category: z.nativeEnum(RiskCategory).describe('Risk category'),
  likelihood: z.nativeEnum(RiskLevel).describe('Likelihood level: H, M, or L'),
  impact: z.nativeEnum(RiskLevel).describe('Impact level: H, M, or L'),
  description: z.string().describe('One-sentence risk description'),
});

const RiskRegisterSchema = z.array(RiskItemSchema).min(4).max(6);

export async function runP2Risks(idea: IdeaJSON): Promise<RiskRegister> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  const prompt = p2RisksPrompt(ideaJsonStr);
  return await callGemini<RiskRegister>({
    prompt,
    schema: RiskRegisterSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an expert risk auditor. Pinpoint exact failure modes with high precision.',
  });
}
