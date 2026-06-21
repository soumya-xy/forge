export enum StageName {
  P0_PROFILE = 'P0_PROFILE',
  P1_INTAKE = 'P1_INTAKE',
  P2_RISKS = 'P2_RISKS',
  P3_POSTURE = 'P3_POSTURE',
  P4_SYNTHESIS = 'P4_SYNTHESIS',
  P5_GATE = 'P5_GATE',
  P6_RESOURCE_MAPPING = 'P6_RESOURCE_MAPPING',
  P7_RESOURCE_RETRIEVAL = 'P7_RESOURCE_RETRIEVAL',
}

export enum RiskCategory {
  EXECUTION = 'execution',
  MARKET = 'market',
  PERSONAL = 'personal',
  TECHNICAL = 'technical',
}

export enum RiskLevel {
  HIGH = 'H',
  MEDIUM = 'M',
  LOW = 'L',
}

export enum EffortLevel {
  LOW = 'low',
  MEDIUM = 'med',
  HIGH = 'high',
}

export enum ExperimentRiskLevel {
  LOW = 'low',
  MEDIUM = 'med',
  HIGH = 'high',
}

export enum ResourceCategory {
  COMMUNITY_VALIDATION = 'community_validation',
  NO_CODE_TOOLS = 'no_code_tools',
  STUDENT_GRANTS = 'student_grants',
  MENTORSHIP_NETWORKS = 'mentorship_networks',
  LEARNING_RESOURCES = 'learning_resources',
  TECHNICAL_INFRASTRUCTURE = 'technical_infrastructure',
  MARKET_RESEARCH = 'market_research',
}

/**
 * P0 — Founder Profile. All fields optional.
 */
export enum UserRole {
  STUDENT = 'student',
  EMPLOYED = 'employed',
  BETWEEN_JOBS = 'between_jobs',
  FOUNDER = 'founder',
}

export enum WeeklyHours {
  HRS_1_TO_5 = '1-5',
  HRS_5_TO_10 = '5-10',
  HRS_10_TO_20 = '10-20',
  HRS_20_PLUS = '20+',
}

export enum PrimaryGoal {
  INCOME = 'income',
  LEARNING = 'learning',
  PORTFOLIO = 'portfolio',
  IMPACT = 'impact',
  EXIT = 'exit',
}

/**
 * P3 — Strategic Posture. Hardcoded set so the AI picks from a known list.
 */
export enum StrategicPosture {
  SHIP_FAST = 'ship_fast',           // ship the smallest thing in days, validate then iterate
  BUILD_MOAT = 'build_moat',         // invest before launch, defensibility over speed
  COMMUNITY_FIRST = 'community_first', // audience + trust before product
}

/**
 * P0 — Cofounder Alignment Score
 */
export enum AlignmentScore {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
