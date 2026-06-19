'use server';
/**
 * @fileOverview A reasoning tool that generates three distinct founder scenarios with unique constraints, blind spots, and success definitions.
 *
 * - generateFounderScenarios - A function that handles the generation of founder scenarios.
 * - GenerateFounderScenariosInput - The input type for the generateFounderScenarios function.
 * - GenerateFounderScenariosOutput - The return type for the generateFounderScenarios function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFounderScenariosInputSchema = z.object({
  problemStatement: z.string().describe('The core problem the idea aims to solve.'),
  targetUsers: z.array(z.string()).describe('Profiles of the target users for the idea.'),
  keyAssumptions: z.array(z.string()).describe('Key assumptions underlying the idea.'),
});
export type GenerateFounderScenariosInput = z.infer<typeof GenerateFounderScenariosInputSchema>;

const FounderScenarioSchema = z.object({
  scenarioName: z.string().describe('A descriptive name for the founder scenario (e.g., "The Lean Innovator", "The Visionary Entrepreneur").'),
  constraints: z.string().describe('Unique constraints this founder persona operates under (e.g., "Bootstrapped with minimal funding", "Limited access to talent network", "Strict regulatory environment").'),
  blindSpots: z.string().describe('Potential blind spots or biases this founder persona might have (e.g., "Overemphasis on technology over user needs", "Underestimates marketing challenges", "Reluctant to delegate").'),
  successDefinition: z.string().describe('How this founder persona defines success for the project (e.g., "Achieving profitability within 12 months", "Securing Series A funding", "Impact millions of users with open-source solution").'),
});

const GenerateFounderScenariosOutputSchema = z.object({
  scenarios: z.array(FounderScenarioSchema).length(3).describe('An array of three distinct founder scenarios.'),
});
export type GenerateFounderScenariosOutput = z.infer<typeof GenerateFounderScenariosOutputSchema>;

export async function generateFounderScenarios(input: GenerateFounderScenariosInput): Promise<GenerateFounderScenariosOutput> {
  return generateFounderScenariosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFounderScenariosPrompt',
  input: {schema: GenerateFounderScenariosInputSchema},
  output: {schema: GenerateFounderScenariosOutputSchema},
  prompt: `You are an expert business strategist and startup advisor. Your task is to help a founder explore different pathways for their idea by generating three distinct founder scenarios. Each scenario must have unique constraints, potential blind spots, and a specific definition of success.\n\nThe idea is based on the following:\nProblem Statement: {{{problemStatement}}}\nTarget Users: {{#each targetUsers}}- {{{this}}}\n{{/each}}\nKey Assumptions: {{#each keyAssumptions}}- {{{this}}}\n{{/each}}\n\nGenerate exactly three (3) distinct founder scenarios. Each scenario should be named, describe its unique constraints, highlight potential blind spots, and articulate a clear definition of success. Ensure the scenarios offer varied perspectives on tackling the problem.`,
});

const generateFounderScenariosFlow = ai.defineFlow(
  {
    name: 'generateFounderScenariosFlow',
    inputSchema: GenerateFounderScenariosInputSchema,
    outputSchema: GenerateFounderScenariosOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);