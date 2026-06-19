import { ai } from '@/ai/genkit';
import { z } from 'genkit';

interface GeminiCallParams<T> {
  prompt: string;
  schema: z.ZodType<T>;
  model?: string;
  system?: string;
}

/**
 * Robust wrapper to call Google Gemini API with Zod structured output.
 */
export async function callGemini<T>({
  prompt,
  schema,
  model = 'googleai/gemini-2.5-flash',
  system,
}: GeminiCallParams<T>): Promise<T> {
  try {
    const response = await ai.generate({
      model,
      prompt,
      system,
      config: {
        temperature: 0.2,
      },
      output: {
        schema,
      },
    });

    if (!response.output) {
      throw new Error('Gemini returned an empty output.');
    }

    return response.output as T;
  } catch (error) {
    console.error(`[GeminiClient Error] Failed calling model ${model}:`, error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred during AI analysis.'
    );
  }
}
