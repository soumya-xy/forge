'use server';

import { z } from 'genkit';
import { callGemini } from '@/lib/geminiClient';
import { IdeaBranch, MilestonePlan, MergePhaseSelection } from '@/types/types';

const MergeRationaleSchema = z.object({
  rationale: z.string().describe('Explanation of why these phases were chosen and how they work together'),
  hybrid_approach_benefits: z.array(z.string()).describe('Benefits of this hybrid approach'),
  considerations: z.array(z.string()).describe('Trade-offs or considerations for the founder'),
});

const MergedRoadmapSchema = z.object({
  day30: z.object({
    focus: z.string().describe('Core focus for day 30'),
    milestones: z.array(z.string()).describe('2-3 concrete milestones'),
    assumption: z.string().describe('Critical assumption being tested'),
    success_signal: z.string().describe('Primary success signal'),
  }),
  day60: z.object({
    focus: z.string().describe('Core focus for day 60'),
    milestones: z.array(z.string()).describe('2-3 concrete milestones'),
    assumption: z.string().describe('Critical assumption being tested'),
    success_signal: z.string().describe('Primary success signal'),
  }),
  day90: z.object({
    focus: z.string().describe('Core focus for day 90'),
    milestones: z.array(z.string()).describe('2-3 concrete milestones'),
    assumption: z.string().describe('Critical assumption being tested'),
    success_signal: z.string().describe('Primary success signal'),
  }),
});

/**
 * P4 Merge Synthesis
 * Combines multiple idea branches into a hybrid roadmap based on user phase selection
 */
export async function runP4MergeSynthesis(
  branches: IdeaBranch[],
  phaseSelection: MergePhaseSelection
): Promise<{ roadmap: MilestonePlan; rationale: string }> {
  // Build context for AI: show which branch contributed each phase
  const selectionContext = Object.entries(phaseSelection).map(([phase, branchId]) => {
    const branch = branches.find((b) => b.id === branchId);
    return {
      phase,
      branch_id: branchId,
      branch_name: branch?.name || 'Unknown',
      posture: branch?.posture.posture || 'unknown',
    };
  });

  const branchesJsonStr = JSON.stringify(branches, null, 2);
  const selectionJsonStr = JSON.stringify(selectionContext, null, 2);

  const prompt = `
You are a startup strategist helping a founder merge insights from multiple strategic approaches.

The founder has explored multiple strategic postures and now wants to create a hybrid roadmap that combines the best elements from each.

Selected Phase Configuration:
${selectionJsonStr}

Available Branches:
${branchesJsonStr}

Your task:
1. Create a hybrid 30/60/90-day roadmap that respects the founder's phase selection
2. Ensure transitions between phases are coherent (e.g., day30 from "Ship Fast" should smoothly connect to day60 from "Build Moat")
3. Blend the philosophical assumptions of different postures into a cohesive narrative
4. Highlight where this hybrid approach creates unique advantages OR tensions

Generate a merged roadmap with:
- day30/day60/day90 phases (use the exact structure from the selected branches)
- Clear rationale explaining WHY this combination makes sense
- Benefits of the hybrid approach
- Considerations/trade-offs the founder should be aware of

Output a JSON object with:
- merged_roadmap: { day30, day60, day90 } with { focus, milestones, assumption, success_signal }
- rationale: Explanation of the hybrid approach
- hybrid_approach_benefits: Array of benefit strings
- considerations: Array of consideration strings
`;

  const MergeSchema = z.object({
    merged_roadmap: MergedRoadmapSchema,
    rationale: z.string().describe('Overall explanation'),
    hybrid_approach_benefits: z.array(z.string()).describe('Benefits'),
    considerations: z.array(z.string()).describe('Trade-offs'),
  });

  const result = await callGemini<z.infer<typeof MergeSchema>>({
    prompt,
    schema: MergeSchema,
    model: 'googleai/gemini-2.5-flash',
    system: 'You are an expert startup strategist. Help founders create coherent hybrid roadmaps that combine multiple strategic approaches.',
  });

  return {
    roadmap: result.merged_roadmap,
    rationale: result.rationale,
  };
}
