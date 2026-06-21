'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { UpdatedRiskRegister, ExperimentLog, PivotSuggestion } from '@/types/types';

const PivotSuggestionSchema = z.object({
  should_pivot: z.boolean().describe('Whether a pivot is recommended'),
  pivot_direction: z.string().describe('Specific pivot direction: "Double down on X", "Pivot to Y", or "Stop — no market"'),
  supporting_evidence: z.string().describe('Rationale for the pivot recommendation based on experiment data'),
  confidence_before: z.number().describe('Overall confidence before experiments'),
  confidence_after: z.number().describe('Overall confidence after experiments'),
  suggested_at: z.string().describe('ISO timestamp of when this suggestion was generated'),
});

/**
 * P10: Detect pivot signals from experiment patterns
 * Analyzes experiment results and risk shifts to recommend pivots
 */
export async function runP10PivotDetection(
  updated_risks: UpdatedRiskRegister,
  experiment_logs: ExperimentLog[]
): Promise<PivotSuggestion> {
  // Only trigger after 3+ experiments
  if (experiment_logs.length < 3) {
    return {
      should_pivot: false,
      pivot_direction: 'Continue current approach',
      supporting_evidence: `Need at least 3 experiments to detect pivot patterns. Currently have ${experiment_logs.length}.`,
      confidence_before: 50,
      confidence_after: updated_risks.overall_confidence,
      suggested_at: new Date().toISOString(),
    };
  }

  const risksJsonStr = JSON.stringify(updated_risks, null, 2);
  const experimentsJsonStr = JSON.stringify(experiment_logs, null, 2);

  const prompt = `
You are a startup strategy advisor analyzing experiment patterns to detect pivot signals.

Updated Risk Analysis:
${risksJsonStr}

Experiment Log:
${experimentsJsonStr}

Your task:
1. Analyze the pattern of experiment results
2. Look for pivot signals:
   - Consistently failing hypotheses (same assumption invalidated multiple times)
   - Dramatic confidence drops (>20 points) across multiple experiments
   - Risk upgrades (LOW→MEDIUM or MEDIUM→HIGH) suggesting fundamental issues
   - Unexpected discoveries that invalidate original assumptions

3. Determine pivot recommendation:
   - "Double down on X": Evidence suggests current approach is working, double investment
   - "Pivot to Y": Evidence shows original bet is flawed, but a new direction emerged
   - "Stop — no market": Evidence shows no viable path forward

4. Provide specific direction and supporting evidence

Output a JSON object with:
- should_pivot: Boolean - whether a strategic change is needed
- pivot_direction: Specific guidance (e.g., "Double down on B2B sales", "Pivot to enterprise licensing", "Stop — no market")
- supporting_evidence: 2-3 sentence rationale citing specific experiment outcomes
- confidence_before: Estimated confidence before experiments (~50)
- confidence_after: Current overall confidence from risk analysis
`;

  const result = await callGemini<z.infer<typeof PivotSuggestionSchema>>({
    prompt,
    schema: PivotSuggestionSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a strategic advisor. Detect when startup experiments reveal fundamental issues or unexpected opportunities that require strategic pivots.',
  });

  return {
    ...result,
    suggested_at: new Date().toISOString(),
  };
}
