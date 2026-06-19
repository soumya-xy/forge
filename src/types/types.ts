import {
  RiskCategory,
  RiskLevel,
  EffortLevel,
  ExperimentRiskLevel,
  ResourceCategory,
} from './enums';

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

export interface FounderScenario {
  scenarioName: string;
  constraints: string;
  blindSpots: string;
  successDefinition: string;
}

export interface FounderScenarios {
  scenarios: FounderScenario[];
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
