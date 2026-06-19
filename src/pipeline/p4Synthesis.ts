'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p4SynthesisPrompt } from '@/prompts/prompts';
import { IdeaJSON, RiskRegister, FounderScenarios, MilestonePlan } from '@/types/types';

const MilestoneSchema = z.object({
  focus: z.string().describe('The primary focus of this 30-day block'),
  milestones: z.array(z.string()).min(2).max(3).describe('2 to 3 concrete milestone items'),
  assumption: z.string().describe('The single critical assumption being tested in this phase'),
  success_signal: z.string().describe('The primary success signal'),
});

const MilestonePlanSchema = z.object({
  day30: MilestoneSchema,
  day60: MilestoneSchema,
  day90: MilestoneSchema,
});

export async function runP4Synthesis(
  idea: IdeaJSON,
  risks: RiskRegister,
  scenarios: FounderScenarios
): Promise<MilestonePlan> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  const riskRegisterStr = JSON.stringify(risks, null, 2);
  const scenariosStr = JSON.stringify(scenarios, null, 2);
  const prompt = p4SynthesisPrompt(ideaJsonStr, riskRegisterStr, scenariosStr);
  return await callGemini<MilestonePlan>({
    prompt,
    schema: MilestonePlanSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an expert product strategist. Design highly focused, phased validation roadmaps.',
  });
}
