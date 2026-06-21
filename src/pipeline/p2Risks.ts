'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p2RisksPrompt, p2InterrogateGeneratePrompt, p2RisksWithInterrogationPrompt } from '@/prompts/prompts';
import { IdeaJSON, RiskRegister, RiskItem, InterrogationItem, UserProfile } from '@/types/types';
import { RiskCategory, RiskLevel } from '@/types/enums';

const RiskItemSchema = z.object({
  risk_name: z.string().describe('Short name of the risk'),
  category: z.nativeEnum(RiskCategory).describe('Risk category'),
  likelihood: z.nativeEnum(RiskLevel).describe('Likelihood level: H, M, or L'),
  impact: z.nativeEnum(RiskLevel).describe('Impact level: H, M, or L'),
  description: z.string().describe('One-sentence risk description'),
});

const RiskRegisterSchema = z.array(RiskItemSchema).min(4).max(6);

const InterrogationItemSchema = z.object({
  id: z.string().describe('Unique identifier'),
  question: z.string().describe('Ground-level friction question'),
  tested_risk: RiskItemSchema.describe('The risk object being evaluated'),
});

const InterrogationSchema = z.object({
  items: z.array(InterrogationItemSchema).min(2).max(3).describe('2 to 3 ground-level friction questions'),
});

export async function runP2InterrogateGenerate(idea: IdeaJSON): Promise<{ items: InterrogationItem[] }> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  const prompt = p2InterrogateGeneratePrompt(ideaJsonStr);
  return await callGemini<{ items: InterrogationItem[] }>({
    prompt,
    schema: InterrogationSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a skeptical product advisor. Generate 2 to 3 highly targeted friction questions.',
  });
}

export async function runP2Risks(
  idea: IdeaJSON,
  interrogations?: InterrogationItem[],
  profile?: UserProfile
): Promise<RiskRegister> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  
  if (interrogations && interrogations.length > 0) {
    const interrogationsJsonStr = JSON.stringify(interrogations, null, 2);
    const prompt = p2RisksWithInterrogationPrompt(ideaJsonStr, interrogationsJsonStr);
    return await callGemini<RiskRegister>({
      prompt,
      schema: RiskRegisterSchema,
      model: 'googleai/gemini-2.5-flash',
      system: 'You are an expert risk auditor. Pinpoint exact failure modes with high precision.',
    });
  }

  // Fallback if somehow called without interrogation data
  const prompt = p2RisksPrompt(ideaJsonStr, profile);
  return await callGemini<RiskRegister>({
    prompt,
    schema: RiskRegisterSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an expert risk auditor. Pinpoint exact failure modes with high precision.',
  });
}