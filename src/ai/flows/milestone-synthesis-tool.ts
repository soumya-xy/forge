'use server';
/**
 * @fileOverview A Genkit flow for the Milestone Synthesis Tool.
 *
 * - synthesizeMilestones - A function that generates a 30/60/90-day execution roadmap.
 * - MilestoneSynthesisToolInput - The input type for the synthesizeMilestones function.
 * - MilestoneSynthesisToolOutput - The return type for the synthesizeMilestones function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MilestoneSynthesisToolInputSchema = z.object({
  ideaDescription: z.string().describe('A detailed description of the user\'s idea.'),
  coreProblem: z.string().describe('The core problem the idea aims to solve.'),
  targetUsers: z.array(z.string()).describe('A list of target user profiles for the idea.'),
  keyAssumptions: z.array(z.string()).describe('A list of key assumptions underlying the idea.'),
});
export type MilestoneSynthesisToolInput = z.infer<typeof MilestoneSynthesisToolInputSchema>;

const MilestoneSchema = z.object({
  milestone: z.string().describe('A key goal or achievement for this period, e.g., "Validate Problem-Solution Fit with 20 Users".'),
  actions: z.array(z.string()).describe('Specific, actionable steps or tasks to achieve the milestone, e.g., "Conduct 20 user interviews", "Build a landing page MVP".'),
  testableAssumptions: z.array(z.string()).describe('Underlying assumptions that will be tested or validated during this period, e.g., "Users are willing to pay for X", "Feature Y is critical for engagement".'),
  successSignals: z.array(z.string()).describe('Observable metrics or signals that indicate progress or success for this milestone, e.g., "50% conversion rate on landing page", "Net Promoter Score (NPS) > 30".'),
});

const MilestoneSynthesisToolOutputSchema = z.object({
  day30: z.array(MilestoneSchema).describe('Execution roadmap for the first 30 days, focusing on validation and initial setup.'),
  day60: z.array(MilestoneSchema).describe('Execution roadmap for the next 30 days (days 31-60), focusing on building core features and early traction.'),
  day90: z.array(MilestoneSchema).describe('Execution roadmap for the next 30 days (days 61-90), focusing on scaling, optimization, and future roadmap.'),
});
export type MilestoneSynthesisToolOutput = z.infer<typeof MilestoneSynthesisToolOutputSchema>;

export async function synthesizeMilestones(input: MilestoneSynthesisToolInput): Promise<MilestoneSynthesisToolOutput> {
  return milestoneSynthesisToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'milestoneSynthesisPrompt',
  input: { schema: MilestoneSynthesisToolInputSchema },
  output: { schema: MilestoneSynthesisToolOutputSchema },
  prompt: `You are an expert strategist and product builder, skilled at breaking down vague ideas into actionable, phased execution plans.
Your task is to create a 30/60/90-day execution roadmap for the following idea, ensuring each phase includes specific milestones, actionable steps, testable assumptions, and clear success signals.

Here is the idea context:
Idea Description: {{{ideaDescription}}}
Core Problem: {{{coreProblem}}}
Target Users: {{#each targetUsers}}- {{{this}}}
{{/each}}
Key Assumptions: {{#each keyAssumptions}}- {{{this}}}
{{/each}}

Strictly adhere to the provided JSON schema for your output. For each 30-day period (day30, day60, day90), provide an array of milestones. Each milestone must contain a 'milestone' string, an 'actions' array of strings, a 'testableAssumptions' array of strings, and a 'successSignals' array of strings.

## 30-Day Plan (Focus on validation and initial setup)
This phase should focus on validating core assumptions, setting up foundational elements, and gathering initial user feedback.

## 60-Day Plan (Focus on building core features and early traction)
This phase should focus on developing key functionalities based on initial feedback, expanding user engagement, and refining the value proposition.

## 90-Day Plan (Focus on scaling, optimization, and future roadmap)
This phase should focus on optimizing the product, exploring growth channels, and planning for sustained development.
`,
});

const milestoneSynthesisToolFlow = ai.defineFlow(
  {
    name: 'milestoneSynthesisToolFlow',
    inputSchema: MilestoneSynthesisToolInputSchema,
    outputSchema: MilestoneSynthesisToolOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
