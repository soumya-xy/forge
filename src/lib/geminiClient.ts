import { ai } from '@/ai/genkit';
import { z } from 'genkit';

interface GeminiCallParams<T> {
  prompt: string;
  schema: z.ZodType<T>;
  model?: string;
  system?: string;
}

const DEFAULT_MODEL = 'googleai/gemini-2.5-flash';

/**
 * Robust wrapper to call Google Gemini API with Zod structured output.
 *
 * Reads GOOGLE_API_KEY and (optionally) GEMINI_MODEL from the environment.
 * Throws a clear error if GOOGLE_API_KEY is missing instead of letting
 * Genkit surface a cryptic plugin initialization failure.
 */
export async function callGemini<T>({
  prompt,
  schema,
  model,
  system,
}: GeminiCallParams<T>): Promise<T> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'Missing GOOGLE_API_KEY. Copy .env.example to .env.local and add your Google AI API key. Get one at https://aistudio.google.com/apikey'
    );
  }

  const resolvedModel = model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;

  try {
    const response = await ai.generate({
      model: resolvedModel,
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
    console.error(`[GeminiClient Error] Failed calling model ${resolvedModel}:`, error);
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred during AI analysis.'
    );
  }
}
