'use server';
/**
 * @fileOverview This file defines a Genkit flow for parsing a user's raw idea
 * into a structured format, identifying core problems, target users, and key assumptions.
 *
 * - ideaIntakeParser - A function that handles the idea intake and parsing process.
 * - IdeaIntakeParserInput - The input type for the ideaIntakeParser function.
 * - IdeaIntakeParserOutput - The return type for the ideaIntakeParser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaIntakeParserInputSchema = z.object({
  ideaDescription: z
    .string()
    .describe("A vague description of the user's idea or concept."),
});
export type IdeaIntakeParserInput = z.infer<typeof IdeaIntakeParserInputSchema>;

const IdeaIntakeParserOutputSchema = z.object({
  coreProblems: z
    .array(z.string())
    .describe('A list of core problems that the idea aims to solve.'),
  targetUsers: z
    .array(z.string())
    .describe('A list of target user profiles or segments for the idea.'),
  keyAssumptions: z
    .array(z.string())
    .describe("A list of critical assumptions underlying the idea's success."),
});
export type IdeaIntakeParserOutput = z.infer<typeof IdeaIntakeParserOutputSchema>;

export async function ideaIntakeParser(
  input: IdeaIntakeParserInput
): Promise<IdeaIntakeParserOutput> {
  return ideaIntakeParserFlow(input);
}

const ideaIntakeParserPrompt = ai.definePrompt({
  name: 'ideaIntakeParserPrompt',
  input: {schema: IdeaIntakeParserInputSchema},
  output: {schema: IdeaIntakeParserOutputSchema},
  prompt: `You are an expert business analyst specializing in early-stage idea validation.
Your task is to take a user's raw, vague idea and structure it into clear, actionable components.

Analyze the provided idea and extract the following:
1.  **Core Problems**: What fundamental issues or pain points does this idea attempt to address?
2.  **Target Users**: Who are the primary individuals or groups that would benefit from this idea? Describe their key characteristics.
3.  **Key Assumptions**: What unproven beliefs or conditions must be true for this idea to be successful?

Present your findings in a structured JSON format as described by the output schema.

User's Idea: {{{ideaDescription}}}`,
});

const ideaIntakeParserFlow = ai.defineFlow(
  {
    name: 'ideaIntakeParserFlow',
    inputSchema: IdeaIntakeParserInputSchema,
    outputSchema: IdeaIntakeParserOutputSchema,
  },
  async (input) => {
    const {output} = await ideaIntakeParserPrompt(input);
    if (!output) {
      throw new Error('Failed to parse idea: No output from AI model.');
    }
    return output;
  }
);
