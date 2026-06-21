import {
  RiskCategory,
  RiskLevel,
  EffortLevel,
  ExperimentRiskLevel,
  ResourceCategory,
  UserRole,
  WeeklyHours,
  PrimaryGoal,
  StrategicPosture,
} from './enums';

/**
 * P0 — Founder Profile. All three fields optional; absent means "skipped".
 */
export interface UserProfile {
  role?: UserRole;
  hours?: WeeklyHours;
  goal?: PrimaryGoal;
}

export interface IdeaJSON {
  title: string;
  core_problem: string;
  target_user: string;
  key_assumption: string;
  ambition_level: number; // 1-5
  domain: string;
}

export interface RiskItem {
  risk_name: string;
  category: RiskCategory;
  likelihood: RiskLevel;
  impact: RiskLevel;
  description: string;
}

export type RiskRegister = RiskItem[];

/**
 * P3 — Strategic Posture. The AI writes concrete descriptions for one of the
 * three hardcoded StrategicPosture values; the user picks one.
 */
export interface PostureOption {
  posture: StrategicPosture;
  name: string;          // e.g. "Ship Fast & Cheap"
  description: string;   // 1-2 sentence framing
  bestFor: string;       // 1 sentence why this fits the user's idea
  tradeoff: string;      // 1 sentence what they're giving up
}

export interface PostureSelection {
  options: PostureOption[];
  chosen?: PostureOption;
}

export interface Milestone {
  focus: string;
  milestones: string[];
  assumption: string;
  success_signal: string;
}

export interface MilestonePlan {
  day30: Milestone;
  day60: Milestone;
  day90: Milestone;
}

export interface CandidateExperiment {
  id: string; // UUID for tracking
  name: string;
  hypothesis: string;
  learn: string;
  effort: EffortLevel;
  risk: ExperimentRiskLevel;
  confidence_score: number; // 1-100% confidence
  uncertainty_rating: string; // e.g. "High Uncertainty / High Reward"
}

export interface MicroActionDraft {
  draft_type: string; // e.g. "Outreach Email", "Customer Survey Form", "Pitch Script"
  draft_content: string; // Drafted copy
}

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  url: string;
  tags: string[];
}

// ============================================================================
// FEATURE #1: IDEA VERSIONING (Git for Startups)
// ============================================================================

export interface IdeaBranch {
  id: string; // UUID
  name: string; // "Ship Fast Branch"
  color: string; // "#C1440E" for visual distinction
  posture: PostureOption;
  roadmap: MilestonePlan;
  experiments: CandidateExperiment[];
  selectedExperiment?: CandidateExperiment;
  created_at: string; // ISO timestamp
}

export interface MergePoint {
  id: string;
  from_branch_ids: string[]; // Source branches
  merged_roadmap: MilestonePlan;
  rationale: string; // AI explanation
  created_at: string;
}

export interface MergePhaseSelection {
  day30_branch_id: string;
  day60_branch_id: string;
  day90_branch_id: string;
  experiments_branch_id: string;
}

export interface VersioningState {
  branches: IdeaBranch[];
  active_branch_id?: string; // Currently viewing
  merge_history: MergePoint[];
  is_branching_mode: boolean;
}

// ============================================================================
// FEATURE #2: LIVE EXPERIMENT LOOP (OODA closure)
// ============================================================================

export interface ExecutionMetrics {
  outreach_count?: number; // Emails sent, interviews conducted
  response_count?: number; // Replies, completions
  conversion_count?: number; // Signups, purchases, commits
  hours_spent: number;
  notes?: string;
}

export interface ExperimentLog {
  id: string; // UUID
  experiment_id: string; // Links to CandidateExperiment.id
  started_at: string; // ISO timestamp
  completed_at?: string;
  status: 'draft' | 'running' | 'completed' | 'abandoned';

  // Execution metrics
  metrics: ExecutionMetrics;

  outcome_summary?: string;
  hypothesis_validated?: boolean; // Did results support the hypothesis?
  confidence_shift: number; // -100 to +100 (confidence change)
}

export interface RiskShift {
  risk_id: string; // Index in original risk register
  risk_name: string; // For display
  from_level: RiskLevel;
  to_level: RiskLevel;
  rationale: string;
}

export interface UpdatedRiskRegister {
  original_risks: RiskRegister; // From P2
  current_risks: RiskRegister; // Updated with experiment data
  risk_shifts: RiskShift[];
  overall_confidence: number; // 0-100 (composite across all experiments)
  updated_at: string; // ISO timestamp
}

export interface PivotSuggestion {
  should_pivot: boolean;
  pivot_direction: string; // "Double down on X", "Pivot to Y", "Stop — no market"
  supporting_evidence: string; // AI rationale
  confidence_before: number;
  confidence_after: number;
  suggested_at: string; // ISO timestamp
}

// ============================================================================
// FEATURE #3: MULTI-IDEA SYNTHESIS
// ============================================================================

export interface IdeaWithInput {
  raw_input: string;
  parsed: IdeaJSON;
}

export interface IdeaSynthesisAnalysis {
  core_bet: string; // "All ideas about X"
  conflicts: string[]; // ["Idea 1 says B2B, Idea 2 says B2C"]
  complementarity: string[]; // ["Idea 1 provides tech, Idea 2 provides distribution"]
  recommendation: 'merge_as_one' | 'pursue_separately' | 'conflicts_resolve_first';
  unified_idea?: IdeaJSON; // If merged_as_one
}

export interface IdeaSynthesis {
  original_ideas: IdeaWithInput[];
  analysis: IdeaSynthesisAnalysis;
  synthesized_at: string; // ISO timestamp
}

// ============================================================================
// FEATURE #4: COFOUNDER ALIGNMENT
// ============================================================================

export interface ConflictItem {
  type: 'posture' | 'time' | 'goal' | 'exit';
  founders: string[]; // ["Founder A", "Founder B"]
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AlignmentSuggestions {
  compromise_posture?: PostureOption;
  phase_split?: { phase: string; lead_founder: string }[];
  conversation_starters: string[]; // Discussion prompts
}

export interface AlignmentAnalysis {
  alignment_score: 'LOW' | 'MEDIUM' | 'HIGH';
  conflicts: ConflictItem[];
  suggestions: AlignmentSuggestions;
  analyzed_at: string; // ISO timestamp
}

export interface InterrogationItem {
  id: string;
  question: string;
  tested_risk: RiskItem;
  answer?: string;
}

export interface Interrogation {
  items: InterrogationItem[];
  isAnswered: boolean;
}

