'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p6ResourceMappingPrompt } from '@/prompts/prompts';
import { CandidateExperiment } from '@/types/types';
import { ResourceCategory } from '@/types/enums';

const ResourceMappingSchema = z.object({
  categories: z.array(z.nativeEnum(ResourceCategory)).max(3).describe('At most 3 relevant resource category labels'),
});

export async function runP6ResourceMapping(chosenExperiment: CandidateExperiment): Promise<ResourceCategory[]> {
  const chosenExperimentStr = JSON.stringify(chosenExperiment, null, 2);
  const prompt = p6ResourceMappingPrompt(chosenExperimentStr);
  const result = await callGemini<{ categories: ResourceCategory[] }>({
    prompt,
    schema: ResourceMappingSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a resource strategist. Identify categories that match the chosen experiment.',
  });
  return result.categories;
}
