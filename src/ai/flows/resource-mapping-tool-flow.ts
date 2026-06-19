'use server';
/**
 * @fileOverview A Genkit flow that matches a selected experiment to relevant high-level support categories.
 *
 * - resourceMappingTool - A function that handles the resource mapping process for a given experiment.
 * - ResourceMappingToolInput - The input type for the resourceMappingTool function.
 * - ResourceMappingToolOutput - The return type for the resourceMappingTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the resource mapping tool
const ResourceMappingToolInputSchema = z.object({
  experimentDescription: z.string().describe('A detailed description of the chosen experiment.'),
  experimentGoal: z.string().describe('The primary objective of the experiment.'),
  testableAssumption: z.string().describe('The specific assumption being tested by the experiment.'),
});
export type ResourceMappingToolInput = z.infer<typeof ResourceMappingToolInputSchema>;

// Output schema for the resource mapping tool
const ResourceMappingToolOutputSchema = z.object({
  supportCategories: z.array(z.string()).describe('An array of high-level support categories relevant to the experiment. Select from: "Funding", "Mentorship & Guidance", "Technical & Development Support", "Market Research & Validation", "Legal & Compliance", "Team & Talent Acquisition", "Networking & Partnerships", "Marketing & User Acquisition", "Product Design & UX", "Operations & Logistics".'),
});
export type ResourceMappingToolOutput = z.infer<typeof ResourceMappingToolOutputSchema>;

// Wrapper function to call the Genkit flow
export async function resourceMappingTool(input: ResourceMappingToolInput): Promise<ResourceMappingToolOutput> {
  return resourceMappingToolFlow(input);
}

// Genkit prompt definition
const resourceMappingPrompt = ai.definePrompt({
  name: 'resourceMappingPrompt',
  input: {schema: ResourceMappingToolInputSchema},
  output: {schema: ResourceMappingToolOutputSchema},
  prompt: `You are an expert resource strategist for early-stage startups. Your task is to analyze a given experiment and identify the most relevant high-level support categories needed to execute it successfully.

Consider the experiment's description, goal, and the assumption it aims to test. Based on these, determine which of the following categories are crucial for its success.

Available high-level support categories to choose from:
- Funding
- Mentorship & Guidance
- Technical & Development Support
- Market Research & Validation
- Legal & Compliance
- Team & Talent Acquisition
- Networking & Partnerships
- Marketing & User Acquisition
- Product Design & UX
- Operations & Logistics

Identify 3-5 most relevant categories. If an experiment requires very specific or niche support not covered by these categories, try to map it to the closest general category.`,
});

// Genkit flow definition
const resourceMappingToolFlow = ai.defineFlow(
  {
    name: 'resourceMappingToolFlow',
    inputSchema: ResourceMappingToolInputSchema,
    outputSchema: ResourceMappingToolOutputSchema,
  },
  async (input) => {
    const {output} = await resourceMappingPrompt(input);
    if (!output) {
        throw new Error('Failed to generate resource mappings.');
    }
    return output;
  }
);
