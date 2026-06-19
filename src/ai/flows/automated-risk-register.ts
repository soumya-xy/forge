'use server';
/**
 * @fileOverview A Genkit flow that identifies critical execution and market risks for a given idea.
 *
 * - identifyRisks - A function that handles the risk identification process.
 * - AutomatedRiskRegisterInput - The input type for the identifyRisks function.
 * - AutomatedRiskRegisterOutput - The return type for the identifyRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedRiskRegisterInputSchema = z.object({
  problems: z.array(z.string()).describe('Core problems the idea aims to solve.'),
  targetUsers: z.string().describe('A description of the target user profiles.'),
  keyAssumptions: z.array(z.string()).describe('Key assumptions underlying the idea.'),
});
export type AutomatedRiskRegisterInput = z.infer<typeof AutomatedRiskRegisterInputSchema>;

const RiskSchema = z.object({
  description: z.string().describe('A detailed description of the risk.'),
  category: z.enum(['execution', 'market']).describe('The category of the risk: "execution" or "market".'),
});

const AutomatedRiskRegisterOutputSchema = z.array(RiskSchema).min(4).max(6).describe('An array of 4 to 6 critical execution and market risks.');
export type AutomatedRiskRegisterOutput = z.infer<typeof AutomatedRiskRegisterOutputSchema>;

export async function identifyRisks(input: AutomatedRiskRegisterInput): Promise<AutomatedRiskRegisterOutput> {
  return automatedRiskRegisterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedRiskRegisterPrompt',
  input: {schema: AutomatedRiskRegisterInputSchema},
  output: {schema: AutomatedRiskRegisterOutputSchema},
  prompt: `You are an expert business strategist and risk analyst. Your task is to identify 4 to 6 critical risks for a new idea, categorizing each risk as either an "execution" risk or a "market" risk.

The idea is defined by the following:
Core Problems:
{{#each problems}}
- {{{this}}}
{{/each}}

Target Users: {{{targetUsers}}}

Key Assumptions:
{{#each keyAssumptions}}
- {{{this}}}
{{/each}}

Identify risks that are crucial and could significantly impact the success of the idea. Provide a concise description for each risk and its category. Ensure there are between 4 and 6 risks in total.

Format your response as a JSON array of objects, where each object has a 'description' and 'category' field.`,
});

const automatedRiskRegisterFlow = ai.defineFlow(
  {
    name: 'automatedRiskRegisterFlow',
    inputSchema: AutomatedRiskRegisterInputSchema,
    outputSchema: AutomatedRiskRegisterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
