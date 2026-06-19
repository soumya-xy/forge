export enum StageName {
  P1_INTAKE = 'P1_INTAKE',
  P2_RISKS = 'P2_RISKS',
  P3_SCENARIOS = 'P3_SCENARIOS',
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
