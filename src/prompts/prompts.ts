import {
  RiskCategory,
  RiskLevel,
  EffortLevel,
  ExperimentRiskLevel,
  ResourceCategory,
  StrategicPosture,
  UserRole,
  WeeklyHours,
  PrimaryGoal,
} from '@/types/enums';
import type { UserProfile } from '@/types/types';

/**
 * Human-readable labels for enums. Used both in the UI and in prompts so the
 * AI sees the same phrasing the user chose.
 */
const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.STUDENT]: 'a student',
  [UserRole.EMPLOYED]: 'employed full-time',
  [UserRole.BETWEEN_JOBS]: 'between jobs / freelance',
  [UserRole.FOUNDER]: 'an existing founder',
};

const HOURS_LABEL: Record<WeeklyHours, string> = {
  [WeeklyHours.HRS_1_TO_5]: '1-5 hours/week',
  [WeeklyHours.HRS_5_TO_10]: '5-10 hours/week',
  [WeeklyHours.HRS_10_TO_20]: '10-20 hours/week',
  [WeeklyHours.HRS_20_PLUS]: '20+ hours/week',
};

const GOAL_LABEL: Record<PrimaryGoal, string> = {
  [PrimaryGoal.INCOME]: 'generate income quickly',
  [PrimaryGoal.LEARNING]: 'learn a new skill or domain',
  [PrimaryGoal.PORTFOLIO]: 'build portfolio / credibility',
  [PrimaryGoal.IMPACT]: 'create social or environmental impact',
  [PrimaryGoal.EXIT]: 'build toward a fundable exit',
};

const POSTURE_LABEL: Record<StrategicPosture, string> = {
  [StrategicPosture.SHIP_FAST]:
    'Ship Fast & Cheap — build the smallest thing, ship in days not weeks, validate before investing',
  [StrategicPosture.BUILD_MOAT]:
    'Build Moat Slowly — invest before launch, prioritize defensibility and depth over speed',
  [StrategicPosture.COMMUNITY_FIRST]:
    'Community-First — build audience, trust, and content before product, pursue grants and partnerships',
};

/**
 * Renders a UserProfile to a single inline paragraph for prompts.
 * Returns null when the profile is empty so callers can branch.
 */
export function renderProfile(profile?: UserProfile): string | null {
  if (!profile) return null;
  const parts: string[] = [];
  if (profile.role) parts.push(`Role: ${ROLE_LABEL[profile.role]}.`);
  if (profile.hours) parts.push(`Time available: ${HOURS_LABEL[profile.hours]}.`);
  if (profile.goal) parts.push(`Primary goal: ${GOAL_LABEL[profile.goal]}.`);
  return parts.length ? parts.join(' ') : null;
}

export const p1IntakePrompt = (idea: string, profile?: UserProfile) => {
  const profileBlock = renderProfile(profile);
  const profileSection = profileBlock
    ? `\nFounder context (use to inform your assessment): ${profileBlock}\n`
    : '\nFounder context: not provided. Assume a neutral default founder.\n';

  return `
You are a rigorous but practical startup advisor.
Analyze the following raw, vague idea and deconstruct it. Do not be encouraging or optimistic by default. Identify real friction.
${profileSection}
User's Idea: "${idea}"

Output a JSON object with:
- title: A concise, catchy name for the project.
- core_problem: The fundamental problem this idea aims to solve.
- target_user: The primary target user profile.
- key_assumption: The most critical, unproven assumption that must be true for this to work.
- ambition_level: A rating from 1 to 5 representing the resource/technical scope.
- domain: The industry or domain of the project.
`;
};

export const p2RisksPrompt = (
  ideaJsonStr: string,
  profile?: UserProfile,
) => {
  const profileBlock = renderProfile(profile);
  const profileSection = profileBlock
    ? `\nFounder context (weight 'personal' risks using these actual constraints — e.g. an employed founder has an "employer finds out" risk; a between-jobs founder has a "runway runs out" risk): ${profileBlock}\n`
    : '\nFounder context: not provided. Treat "personal" risks generically.\n';

  return `
You are conducting a Pre-Mortem Retrospective Analysis on this concept.
Assume that 12 months from now, this startup has completely failed and collapsed. Let's work backwards and analyze exactly why it failed. Identify 4 to 6 critical, non-trivial failure modes. Do not sugarcoat them.
${profileSection}
Concept Data:
${ideaJsonStr}

For each failure mode, provide:
- risk_name: Short name of the failure mode.
- category: One of: "${RiskCategory.EXECUTION}", "${RiskCategory.MARKET}", "${RiskCategory.PERSONAL}", or "${RiskCategory.TECHNICAL}".
- likelihood: One of: "${RiskLevel.HIGH}", "${RiskLevel.MEDIUM}", or "${RiskLevel.LOW}" (as H, M, or L).
- impact: One of: "${RiskLevel.HIGH}", "${RiskLevel.MEDIUM}", or "${RiskLevel.LOW}" (as H, M, or L).
- description: A one-sentence explanation of what caused the project to fail retrospectively.
`;
};

/**
 * P3 — Strategic Posture selection. The AI must produce exactly 3 options,
 * one tagged with each of the three StrategicPosture enum values. The user
 * picks one; that choice seeds P4 / P5 / P8.
 */
export const p3PosturesPrompt = (
  ideaJsonStr: string,
  riskRegisterStr: string,
  profile?: UserProfile,
) => {
  const profileBlock = renderProfile(profile);
  const profileSection = profileBlock
    ? `\nFounder context (use to pick which posture is most realistic given these constraints): ${profileBlock}\n`
    : '\nFounder context: not provided. Pick postures on their intrinsic merit.\n';

  return `
You are a startup strategist helping a founder choose a strategic posture — the overall approach they'll take to bring this idea to life.

The founder will commit to ONE of three postures before moving to execution. Each posture must be a distinct strategic philosophy, not a stylistic variant.

Concept Data:
${ideaJsonStr}

Risk Register:
${riskRegisterStr}
${profileSection}
The three allowed postures (use exactly these enum values):
- "${StrategicPosture.SHIP_FAST}" — ${POSTURE_LABEL[StrategicPosture.SHIP_FAST]}
- "${StrategicPosture.BUILD_MOAT}" — ${POSTURE_LABEL[StrategicPosture.BUILD_MOAT]}
- "${StrategicPosture.COMMUNITY_FIRST}" — ${POSTURE_LABEL[StrategicPosture.COMMUNITY_FIRST]}

Produce exactly 3 options, each tagged with a different posture enum value:
- posture: One of the three enum values above (use each exactly once).
- name: A 2-4 word label (e.g. "Ship Fast & Cheap", "Defensible Deep Tech", "Audience Before Product").
- description: 1-2 sentences framing what this posture means in practice for THIS idea.
- bestFor: 1 sentence on why this posture is a fit for the founder's idea and situation.
- tradeoff: 1 sentence on what the founder gives up by choosing this posture.

Do not add a 4th posture. Do not invent new enum values. Do not soften the tradeoffs.
`;
};

export const p4SynthesisPrompt = (
  ideaJsonStr: string,
  riskRegisterStr: string,
  posturesStr: string,
  profile?: UserProfile,
  chosenPosture?: StrategicPosture,
) => {
  const profileBlock = renderProfile(profile);
  const profileSection = profileBlock ? ` ${profileBlock}` : '';
  const postureLine = chosenPosture
    ? `\nChosen strategic posture: ${POSTURE_LABEL[chosenPosture]}. Weight milestones accordingly — e.g. for SHIP_FAST, day-30 milestones are concrete and shippable; for BUILD_MOAT, day-60/90 carry more weight; for COMMUNITY_FIRST, day-30 emphasizes audience-building.\n`
    : '\nNo strategic posture chosen yet — produce a balanced 30/60/90 plan.\n';

  return `
You are an expert product strategist.
Synthesize a realistic 30/60/90-day execution roadmap based on the idea, risks, and chosen posture.
Ensure the milestones are concrete and actionable. Do not be overly optimistic.${profileSection ? `\nFounder context:${profileSection}\n` : ''}${postureLine}

Concept Data:
${ideaJsonStr}

Risks:
${riskRegisterStr}

Strategic Posture Options:
${posturesStr}

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
};

export const p5GatePrompt = (
  milestonePlanStr: string,
  chosenPosture?: StrategicPosture,
  profile?: UserProfile,
) => {
  const profileBlock = renderProfile(profile);
  const profileSection = profileBlock
    ? `\nFounder context (size experiments to fit these constraints — don't suggest a 40-hour/week experiment to someone with 1-5 hours): ${profileBlock}\n`
    : '\nFounder context: not provided. Suggest experiments across the effort spectrum.\n';

  const postureSection = chosenPosture
    ? `\nFrame all three experiments in the voice of the chosen posture: ${POSTURE_LABEL[chosenPosture]}. For SHIP_FAST, lean toward "ship in 48 hours" framing; for BUILD_MOAT, lean toward depth/defensibility framing; for COMMUNITY_FIRST, lean toward audience-and-trust framing.\n`
    : '\nNo posture chosen — frame experiments neutrally.\n';

  return `
You are a startup advisor. Based on the 30/60/90-day milestone plan, generate exactly 3 candidate "first experiments" that the user could run in week 1 or 2 to validate their most critical assumptions.
Constraint: Each experiment must test a DIFFERENT assumption. Do not generate three variants of the same bet.${profileSection}${postureSection}

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
};

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

export const p8MicroActionPrompt = (
  ideaJsonStr: string,
  chosenExperimentStr: string,
  profile?: UserProfile,
  chosenPosture?: StrategicPosture,
) => {
  const profileBlock = renderProfile(profile);
  const profileSection = profileBlock
    ? `\nFounder context (let tone and audience match this profile): ${profileBlock}\n`
    : '\nFounder context: not provided. Use a neutral, professional tone.\n';

  const postureSection = chosenPosture
    ? `\nChosen posture: ${POSTURE_LABEL[chosenPosture]}. Adjust tone: SHIP_FAST → punchy, direct, action-oriented; BUILD_MOAT → measured, substantive, credibility-building; COMMUNITY_FIRST → warmer, narrative, value-first.\n`
    : '\nNo posture chosen. Use a neutral professional tone.\n';

  return `
You are an execution coach. The user is ready to take their "First Real Step" to execute this startup experiment.
Your goal is to write the exact, custom, copy-pasteable script, pitch, outreach template, landing page text, or grant introduction paragraph they need.${profileSection}${postureSection}

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
};

/**
 * P0 — Cofounder Alignment Analysis
 * Analyzes multiple founder profiles for conflicts and alignment risks
 */
export const p0AlignmentPrompt = (profilesJsonStr: string) => `
You are an expert startup advisor specializing in team dynamics and founder alignment. You've been given multiple founder profiles. Your job is to identify real conflicts that could derail the startup before it launches.

Founder Profiles:
${profilesJsonStr}

Analyze the profiles for conflicts across four dimensions:

1. **Posture Conflicts**: Different strategic preferences (speed vs. depth, audience-first vs. product-first)
2. **Time Conflicts**: Mismatched time commitments (one founder has 1-5 hrs, another has 20+ hrs)
3. **Goal Conflicts**: Misaligned objectives (income vs. learning, portfolio vs. exit)
4. **Exit Misalignment**: Different expectations on timeline and exit strategy

For each conflict, provide:
- type: One of: "posture", "time", "goal", "exit"
- founders: Array of founder identifiers (e.g., ["Founder A", "Founder B"])
- description: Clear explanation of the specific conflict
- severity: One of: "HIGH", "MEDIUM", "LOW" (how severe this conflict is)

Then provide suggestions to resolve conflicts:
- compromise_posture: A suggested posture that balances different preferences
- phase_split: If founders have different strengths, suggest phase-by-phase leadership
- conversation_starters: 3-5 discussion prompts to help founders resolve conflicts

Finally, give an overall alignment_score: "LOW" (many severe conflicts), "MEDIUM" (some conflicts), "HIGH" (well-aligned)

Output a JSON object with:
- alignment_score: Overall alignment (LOW/MEDIUM/HIGH)
- conflicts: Array of conflict objects
- suggestions: Object with compromise_posture (optional), phase_split (optional), conversation_starters (array)
`;

/**
 * P1 — Multi-Idea Synthesis
 * Analyzes multiple startup ideas to find core bets, conflicts, and complementarities
 */
export const p1MultiIdeaSynthesisPrompt = (ideasJsonStr: string) => `
You are an expert startup strategist. You've been given multiple startup ideas that may be related, conflicting, or complementary. Your job is to analyze them and identify patterns.

Ideas (with parsed structures):
${ideasJsonStr}

Analyze the ideas across three dimensions:

1. **Core Bet**: What do ALL ideas have in common? What's the fundamental thesis?
   - Example: "All three ideas are about reducing transaction costs in marketplaces"
   - Example: "Core bet is that AI can automate legal discovery"

2. **Conflicts**: Where do ideas contradict each other?
   - Example: "Idea #1 assumes B2B customers, Idea #2 assumes B2C customers — these are different Go-To-Market strategies"
   - Example: "Idea #1 requires deep R&D, Idea #2 requires quick speed — conflicting resource allocation"

3. **Complementarity**: How could ideas strengthen each other?
   - Example: "Idea #1 provides technology, Idea #2 provides distribution channel"
   - Example: "Idea #1 targets early adopters, Idea #2 scales to mainstream"

Then provide a recommendation:
- "merge_as_one": Ideas are different expressions of the same core bet — pursue as unified concept
- "pursue_separately": Ideas are fundamentally different — pick one and focus
- "conflicts_resolve_first": Ideas have contradictions — resolve these before proceeding

If recommending "merge_as_one", create a unified_idea that combines the strongest elements from each idea.

Output a JSON object with:
- original_ideas: Array of {raw_input, parsed} objects (pass through)
- analysis: {
    core_bet: string,
    conflicts: string[],
    complementarity: string[],
    recommendation: "merge_as_one" | "pursue_separately" | "conflicts_resolve_first",
    unified_idea: IdeaJSON (only if recommendation is "merge_as_one")
  }
`;