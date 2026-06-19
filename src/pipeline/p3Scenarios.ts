'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p3ScenariosPrompt } from '@/prompts/prompts';
import { IdeaJSON, RiskRegister, FounderScenarios } from '@/types/types';

const FounderScenarioSchema = z.object({
  scenarioName: z.string().describe('Descriptive founder persona name'),
  constraints: z.string().describe('Structural constraints the founder faces (time, money, network, etc.)'),
  blindSpots: z.string().describe('Blind spots or assumptions the founder overlooks'),
  successDefinition: z.string().describe('How this founder defines project success'),
});

const FounderScenariosSchema = z.object({
  scenarios: z.array(FounderScenarioSchema).length(3).describe('Exactly 3 distinct scenarios'),
});

export async function runP3Scenarios(idea: IdeaJSON, risks: RiskRegister): Promise<FounderScenarios> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  const riskRegisterStr = JSON.stringify(risks, null, 2);
  const prompt = p3ScenariosPrompt(ideaJsonStr, riskRegisterStr);
  return await callGemini<FounderScenarios>({
    prompt,
    schema: FounderScenariosSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a veteran startup advisor. Craft realistic, constrained, and non-idealized founder profiles.',
  });
}
