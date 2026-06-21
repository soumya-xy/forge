'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { p8MicroActionPrompt } from '@/prompts/prompts';
import {
  IdeaJSON,
  CandidateExperiment,
  MicroActionDraft,
  UserProfile,
} from '@/types/types';
import { StrategicPosture } from '@/types/enums';

const MicroActionDraftSchema = z.object({
  draft_type: z.string().describe('Outreach Email, Interview Script, Landing Page Headline, or Grant application introduction copy category'),
  draft_content: z.string().describe('Complete markdown formatted ready-to-use template text'),
});

export async function runP8MicroActionDraft(
  idea: IdeaJSON,
  chosenExperiment: CandidateExperiment,
  profile?: UserProfile,
  chosenPosture?: StrategicPosture,
): Promise<MicroActionDraft> {
  const ideaJsonStr = JSON.stringify(idea, null, 2);
  const chosenExperimentStr = JSON.stringify(chosenExperiment, null, 2);
  const prompt = p8MicroActionPrompt(ideaJsonStr, chosenExperimentStr, profile, chosenPosture);

  return await callGemini<MicroActionDraft>({
    prompt,
    schema: MicroActionDraftSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a highly pragmatic startup execution coach. Provide custom, hyper-actionable, template-free copywriting.',
  });
}