'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { IdeaJSON, RiskRegister, ExperimentLog, UpdatedRiskRegister } from '@/types/types';
import { RiskLevel, RiskCategory } from '@/types/enums';

const RiskShiftSchema = z.object({
  risk_id: z.string().describe('Risk identifier (e.g., risk-0, risk-1)'),
  risk_name: z.string().describe('Name of the risk for display'),
  from_level: z.nativeEnum(RiskLevel).describe('Original risk level'),
  to_level: z.nativeEnum(RiskLevel).describe('Updated risk level based on experiment data'),
  rationale: z.string().describe('Explanation of why this risk changed'),
});

const UpdatedRiskRegisterSchema = z.object({
  original_risks: z.any().describe('Original risk register (passed through)'),
  current_risks: z.any().describe('Updated risk register with new levels'),
  risk_shifts: z.array(RiskShiftSchema).describe('Array of risk level changes'),
  overall_confidence: z.number().describe('Overall confidence score from 0-100'),
  updated_at: z.string().describe('ISO timestamp of when this update was performed'),
});

/**
 * P9: Re-run risk analysis with real experiment data
 * Takes original risks and experiment logs, outputs updated risk assessment
 */
export async function runP9ReRiskAnalysis(
  original_risks: RiskRegister,
  experiment_logs: ExperimentLog[],
  idea: IdeaJSON
): Promise<UpdatedRiskRegister> {
  if (experiment_logs.length === 0) {
    return {
      original_risks,
      current_risks: original_risks,
      risk_shifts: [],
      overall_confidence: 50,
      updated_at: new Date().toISOString(),
    };
  }

  // Build experiment summary for AI
  const experimentSummary = experiment_logs.map((log) => ({
    experiment_id: log.experiment_id,
    status: log.status,
    metrics: log.metrics,
    hypothesis_validated: log.hypothesis_validated,
    confidence_shift: log.confidence_shift,
  }));

  const risksJsonStr = JSON.stringify(original_risks, null, 2);
  const experimentsJsonStr = JSON.stringify(experimentSummary, null, 2);
  const ideaJsonStr = JSON.stringify(idea, null, 2);

  const prompt = `
You are conducting a Re-Risk Analysis based on real experiment data.

Original Risk Register:
${risksJsonStr}

Experiment Results:
${experimentsJsonStr}

Startup Context:
${ideaJsonStr}

Your task:
1. Review each original risk and assess how the experiment results impact its likelihood and impact
2. Update risk levels (H/M/L) based on actual data
3. Provide rationale for each risk level change
4. Calculate overall confidence (0-100) based on:
   - Number of experiments completed
   - Percentage of hypotheses validated
   - Magnitude of confidence shifts
   - Reduction in high-severity risks

Risk level changes:
- Downgrade (H→M, M→L): Experiment data suggests this risk is less likely or impactful
- No change: Insufficient data to change assessment
- Upgrade (L→M, M→H): Experiment data reveals new concerns

Output a JSON object with:
- original_risks: Original risk register (pass through)
- current_risks: Updated risk register with modified levels
- risk_shifts: Array of { risk_id, from_level, to_level, rationale }
- overall_confidence: Number from 0-100 representing overall confidence
`;

  const result = await callGemini<z.infer<typeof UpdatedRiskRegisterSchema>>({
    prompt,
    schema: UpdatedRiskRegisterSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are a risk analyst specializing in startup validation. Assess how real-world experiment data changes risk profiles.',
  });

  return {
    ...result,
    original_risks,
    current_risks: result.current_risks,
    updated_at: new Date().toISOString(),
  };
}
