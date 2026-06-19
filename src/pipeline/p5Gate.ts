'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p5GatePrompt } from '@/prompts/prompts';
import { MilestonePlan, CandidateExperiment } from '@/types/types';
import { EffortLevel, ExperimentRiskLevel } from '@/types/enums';

const CandidateExperimentSchema = z.object({
  name: z.string().describe('A punchy name for the experiment'),
  hypothesis: z.string().describe('1-2 sentences hypothesis statement'),
  learn: z.string().describe('What you will learn from this experiment'),
  effort: z.nativeEnum(EffortLevel).describe('Effort level required: low, med, high'),
  risk: z.nativeEnum(ExperimentRiskLevel).describe('Risk level of execution: low, med, high'),
  confidence_score: z.number().min(1).max(100).describe('Baseline confidence level from 1 to 100'),
  uncertainty_rating: z.string().describe('Visual rating text, e.g. "High Uncertainty / High Reward"'),
});

const CandidateExperimentsSchema = z.object({
  experiments: z.array(CandidateExperimentSchema).length(3).describe('Exactly 3 experiments'),
});

export async function runP5Gate(milestonePlan: MilestonePlan): Promise<CandidateExperiment[]> {
  const milestonePlanStr = JSON.stringify(milestonePlan, null, 2);
  const prompt = p5GatePrompt(milestonePlanStr);
  const result = await callGemini<{ experiments: CandidateExperiment[] }>({
    prompt,
    schema: CandidateExperimentsSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an entrepreneurial mentor. Help founders form testable, distinct low-cost experiments.',
  });
  return result.experiments;
}
