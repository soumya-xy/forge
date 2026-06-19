import { RiskCategory, RiskLevel, EffortLevel, ExperimentRiskLevel, ResourceCategory } from '@/types/enums';

export const p1IntakePrompt = (idea: string) => `
You are a rigorous but practical startup advisor.
Analyze the following raw, vague idea and deconstruct it. Do not be encouraging or optimistic by default. Identify real friction.

User's Idea: "${idea}"

Output a JSON object with:
- title: A concise, catchy name for the project.
- core_problem: The fundamental problem this idea aims to solve.
- target_user: The primary target user profile.
- key_assumption: The most critical, unproven assumption that must be true for this to work.
- ambition_level: A rating from 1 to 5 representing the resource/technical scope.
- domain: The industry or domain of the project.
`;

export const p2RisksPrompt = (ideaJsonStr: string) => `
You are conducting a Pre-Mortem Retrospective Analysis on this concept.
Assume that 12 months from now, this startup has completely failed and collapsed. Let's work backwards and analyze exactly why it failed. Identify 4 to 6 critical, non-trivial failure modes. Do not sugarcoat them.

Concept Data:
${ideaJsonStr}

For each failure mode, provide:
- risk_name: Short name of the failure mode.
- category: One of: "${RiskCategory.EXECUTION}", "${RiskCategory.MARKET}", "${RiskCategory.PERSONAL}", or "${RiskCategory.TECHNICAL}".
- likelihood: One of: "${RiskLevel.HIGH}", "${RiskLevel.MEDIUM}", or "${RiskLevel.LOW}" (as H, M, or L).
- impact: One of: "${RiskLevel.HIGH}", "${RiskLevel.MEDIUM}", or "${RiskLevel.LOW}" (as H, M, or L).
- description: A one-sentence explanation of what caused the project to fail retrospectively.
`;

export const p3ScenariosPrompt = (ideaJsonStr: string, riskRegisterStr: string) => `
You are a startup mentor. Create 3 distinct founder scenarios/personas attempting this idea.
Constraint: Each persona must have at least one structural disadvantage (such as lack of time, lack of money, poor network, or no technical skills). Do not write idealized founders. Make them feel like real, flawed people.

Concept Data:
${ideaJsonStr}

Risk Register:
${riskRegisterStr}

Provide 3 distinct founder scenarios:
- scenarioName: E.g., "Final-year engineering student with 8 weeks before placements", "Part-time founder with a demanding day job", "Non-technical founder pivoting after a failed project".
- constraints: Their unique operational boundaries.
- blindSpots: Potential assumptions they are missing.
- successDefinition: How they define success for this project.
`;

export const p4SynthesisPrompt = (ideaJsonStr: string, riskRegisterStr: string, scenariosStr: string) => `
You are an expert product strategist.
Synthesize a realistic 30/60/90-day execution roadmap based on the idea, risks, and scenarios.
Ensure the milestones are concrete and actionable. Do not be overly optimistic.

Concept Data:
${ideaJsonStr}

Risks:
${riskRegisterStr}

Strategic Scenarios:
${scenariosStr}

Generate a milestone plan with three phases:
1. day30 (Validation phase):
   - focus: The core focus.
   - milestones: 2 to 3 concrete milestone items.
   - assumption: The single critical assumption being tested in this phase.
   - success_signal: The primary success signal.
2. day60 (Execution/Early Traction phase):
   - focus: The core focus.
   - milestones: 2 to 3 concrete milestone items.
   - assumption: The single critical assumption being tested in this phase.
   - success_signal: The primary success signal.
3. day90 (Optimization/Future Roadmap phase):
   - focus: The core focus.
   - milestones: 2 to 3 concrete milestone items.
   - assumption: The single critical assumption being tested in this phase.
   - success_signal: The primary success signal.
`;

export const p5GatePrompt = (milestonePlanStr: string) => `
You are a startup advisor. Based on the 30/60/90-day milestone plan, generate exactly 3 candidate "first experiments" that the user could run in week 1 or 2 to validate their most critical assumptions.
Constraint: Each experiment must test a DIFFERENT assumption. Do not generate three variants of the same bet.

Milestone Plan:
${milestonePlanStr}

For each of the 3 experiments, provide:
- name: A punchy name for the experiment.
- hypothesis: 1-2 sentences detailing the testable hypothesis (e.g. "If we post X in Y community, Z users will sign up").
- learn: Exactly what the user will learn from this experiment.
- effort: One of: "${EffortLevel.LOW}", "${EffortLevel.MEDIUM}", or "${EffortLevel.HIGH}" (low/med/high).
- risk: One of: "${ExperimentRiskLevel.LOW}", "${ExperimentRiskLevel.MEDIUM}", or "${ExperimentRiskLevel.HIGH}" (low/med/high).
- confidence_score: A number from 1 to 100 representing our baseline confidence level (lower score = higher uncertainty of success).
- uncertainty_rating: A short text indicator mapping uncertainty and reward potential, e.g., "High Uncertainty / High Reward", "Moderate Risk / High Certainty", "Low Uncertainty / Low Reward".
`;

export const p6ResourceMappingPrompt = (chosenExperimentStr: string) => `
You are a resource allocator for early-stage startups.
Analyze the chosen experiment and map it to relevant support categories.

Chosen Experiment:
${chosenExperimentStr}

Constraint: Output ONLY category labels from this allowed list:
- "${ResourceCategory.COMMUNITY_VALIDATION}"
- "${ResourceCategory.NO_CODE_TOOLS}"
- "${ResourceCategory.STUDENT_GRANTS}"
- "${ResourceCategory.MENTORSHIP_NETWORKS}"
- "${ResourceCategory.LEARNING_RESOURCES}"
- "${ResourceCategory.TECHNICAL_INFRASTRUCTURE}"
- "${ResourceCategory.MARKET_RESEARCH}"

Output max 3 labels as a JSON array of strings. Output nothing else.
`;

export const p8MicroActionPrompt = (ideaJsonStr: string, chosenExperimentStr: string) => `
You are an execution coach. The user is ready to take their "First Real Step" to execute this startup experiment.
Your goal is to write the exact, custom, copy-pasteable script, pitch, outreach template, landing page text, or grant introduction paragraph they need.

Concept Data:
${ideaJsonStr}

Chosen Experiment:
${chosenExperimentStr}

Determine the best format for the first micro-action:
- If outreach-driven: Write a complete email/message pitch (with Subject line and body).
- If survey-driven: Write a brief customer interview script (intro + 3-4 specific questions).
- If landing-page-driven: Write the exact headline, sub-headline, and call-to-action button copy.
- If grant-related: Write the critical first paragraph of their grant application deconstructing the problem/solution.

Keep it direct, professional, and free of fluff.
Output a JSON object with:
- draft_type: The label of what you wrote (e.g., "Cold Outreach Email", "Customer Interview Script", "Landing Page Copy Structure", "Grant Application Pitch").
- draft_content: The complete ready-to-use template formatted in clean markdown. Use placeholders like [Name] only where absolutely necessary.
`;
