"use client";

import { useState, useEffect } from "react";
import {
  IdeaJSON,
  RiskRegister,
  PostureSelection,
  PostureOption,
  MilestonePlan,
  CandidateExperiment,
  ResourceItem,
  MicroActionDraft,
  UserProfile,
  VersioningState,
  ExperimentLog,
  UpdatedRiskRegister,
  PivotSuggestion,
  IdeaSynthesis,
  AlignmentAnalysis,
  MergePhaseSelection,
  Interrogation,
  InterrogationItem,
} from "@/types/types";
import { StrategicPosture, ResourceCategory } from "@/types/enums";

import { runP1Intake } from "@/pipeline/p1Intake";
import { runP2Risks, runP2InterrogateGenerate } from "@/pipeline/p2Risks";
import { runP3Postures } from "@/pipeline/p3Postures";
import { runP4Synthesis } from "@/pipeline/p4Synthesis";
import { runP5Gate } from "@/pipeline/p5Gate";
import { runP6ResourceMapping } from "@/pipeline/p6ResourceMapping";
import { runP7ResourceRetrieval } from "@/pipeline/p7ResourceRetrieval";
import { runP8MicroActionDraft } from "@/pipeline/p8MicroActionDraft";
import { runP0AlignmentAnalysis } from "@/pipeline/p0AlignmentAnalysis";
import { runP1MultiIdeaSynthesis } from "@/pipeline/p1MultiIdeaSynthesis";
import { runP4MergeSynthesis } from "@/pipeline/p4MergeSynthesis";
import { runP9ReRiskAnalysis } from "@/pipeline/p9ReRiskAnalysis";
import { runP10PivotDetection } from "@/pipeline/p10PivotDetection";

import StageProfile from "./stages/StageProfile";
import StageIntake from "./stages/StageIntake";
import StageAlignmentReport from "./stages/StageAlignmentReport";
import StageIdeaSynthesis from "./stages/StageIdeaSynthesis";
import StageRisks from "./stages/StageRisks";
import StagePosture from "./stages/StagePosture";
import StageVersioningDiff from "./stages/StageVersioningDiff";
import StageRoadmap from "./stages/StageRoadmap";
import StageTheGate from "./stages/StageTheGate";
import StageResources from "./stages/StageResources";
import StageExperimentTracker from "./stages/StageExperimentTracker";
import Stepper from "./ui/Stepper";
import BranchSwitcher from "./ui/BranchSwitcher";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

const LOCAL_STORAGE_KEY = "forge-state-v3";

// v2 AppState structure (for migration)
interface AppStateV2 {
  profile?: UserProfile;
  ideaDescription: string;
  parsedIdea?: IdeaJSON;
  risks?: RiskRegister;
  postures?: PostureSelection;
  chosenPosture?: PostureOption;
  roadmap?: MilestonePlan;
  experiments?: CandidateExperiment[];
  selectedExperiment?: CandidateExperiment;
  supportCategories?: ResourceCategory[];
  matchedResources?: ResourceItem[];
  microActionDraft?: MicroActionDraft;
  currentStep: number;
}

// v3 AppState structure with all innovative features
interface AppState {
  // Multi-founder support (was single profile)
  profiles: UserProfile[];

  // Multi-idea support (was single ideaDescription)
  raw_ideas: string[];

  // Existing pipeline data
  parsedIdea?: IdeaJSON;
  risks?: RiskRegister;
  postures?: PostureSelection;
  chosenPosture?: PostureOption;
  roadmap?: MilestonePlan;
  experiments?: CandidateExperiment[];
  selectedExperiment?: CandidateExperiment;
  supportCategories?: ResourceCategory[];
  matchedResources?: ResourceItem[];
  microActionDraft?: MicroActionDraft;
  interrogation?: Interrogation;

  // FEATURE #1: Idea Versioning
  versioning?: VersioningState;

  // FEATURE #2: Live Experiment Loop
  experiment_logs?: ExperimentLog[];
  updated_risks?: UpdatedRiskRegister;
  pivot_suggestion?: PivotSuggestion;

  // FEATURE #3: Multi-Idea Synthesis
  idea_synthesis?: IdeaSynthesis;

  // FEATURE #4: Cofounder Alignment
  alignment?: AlignmentAnalysis;

  // Progress tracking
  currentStep: number;
}

// Migration function: v2 → v3
function migrateV2ToV3(v2State: AppStateV2): AppState {
  return {
    // Convert single profile to array
    profiles: v2State.profile ? [v2State.profile] : [],

    // Convert single ideaDescription to array
    raw_ideas: v2State.ideaDescription ? [v2State.ideaDescription] : [],

    // Copy existing pipeline data
    parsedIdea: v2State.parsedIdea,
    risks: v2State.risks,
    postures: v2State.postures,
    chosenPosture: v2State.chosenPosture,
    roadmap: v2State.roadmap,
    experiments: v2State.experiments,
    selectedExperiment: v2State.selectedExperiment,
    supportCategories: v2State.supportCategories,
    matchedResources: v2State.matchedResources,
    microActionDraft: v2State.microActionDraft,

    // Initialize new feature states (empty for migration)
    versioning: undefined,
    experiment_logs: undefined,
    updated_risks: undefined,
    pivot_suggestion: undefined,
    idea_synthesis: undefined,
    alignment: undefined,

    // Copy progress tracking
    currentStep: v2State.currentStep,
  };
}

export default function ForgeApp() {
  const [state, setState] = useState<AppState>({
    profiles: [],
    raw_ideas: [],
    currentStep: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<{ label: string; action: () => void } | null>(null);
  const [savedStateToRestore, setSavedStateToRestore] = useState<AppState | null>(null);

  // Load from localStorage (v3 schema with v2 migration)
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Check if this is v2 format (has ideaDescription, not raw_ideas)
        if ('ideaDescription' in parsed && !('raw_ideas' in parsed)) {
          console.log('Migrating v2 state to v3 format');
          const v3State = migrateV2ToV3(parsed as AppStateV2);
          if (v3State.parsedIdea) {
            setSavedStateToRestore(v3State);
          }
        } else if (parsed && parsed.parsedIdea) {
          // Already v3 format
          setSavedStateToRestore(parsed as AppState);
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save to localStorage
  const saveState = (newState: AppState) => {
    setState(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  };

  const handleRestoreState = () => {
    if (savedStateToRestore) {
      setState(savedStateToRestore);
      setSavedStateToRestore(null);
    }
  };

  const resetApp = () => {
    if (confirm("Are you sure you want to reset? This will clear all progress.")) {
      setState({
        profiles: [],
        raw_ideas: [],
        currentStep: 0,
      });
      setSavedStateToRestore(null);
      setError(null);
      setRetryAction(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // P0: Profile submit (optional) -> alignment analysis if multiple founders -> advance to P1
  const handleProfileSubmit = async (profiles: UserProfile[]) => {
    setError(null);
    setLoading(true);
    setLoadingLabel("Analyzing team alignment...");

    const execute = async () => {
      try {
        // Run alignment analysis if multiple founders
        let alignment: AlignmentAnalysis | undefined;
        if (profiles.length >= 2) {
          alignment = await runP0AlignmentAnalysis(profiles);
        }

        saveState({
          ...state,
          profiles,
          alignment,
          currentStep: 1,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to analyze team alignment.");
        setRetryAction({
          label: "Retry Profile Submit",
          action: () => handleProfileSubmit(profiles),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // P1: Intake -> multi-idea synthesis if multiple ideas -> P2
  const handleIntakeSubmit = async (ideas: string[]) => {
    setError(null);
    setLoading(true);
    setLoadingLabel(
      ideas.length > 1 ? "Analyzing multiple ideas..." : "Parsing idea..."
    );

    const execute = async () => {
      try {
        let parsedIdea: IdeaJSON;
        let ideaSynthesis: IdeaSynthesis | undefined;

        if (ideas.length > 1) {
          // Run multi-idea synthesis
          setLoadingLabel("Synthesizing multiple ideas...");
          const synthesis = await runP1MultiIdeaSynthesis(ideas);

          // Check if we should merge or pursue separately
          if (synthesis.analysis.recommendation === "merge_as_one" && synthesis.analysis.unified_idea) {
            // Use unified idea
            parsedIdea = synthesis.analysis.unified_idea;
            setLoadingLabel("Generating interrogation...");
            const interrogationData = await runP2InterrogateGenerate(parsedIdea);
            saveState({
              ...state,
              raw_ideas: ideas,
              parsedIdea,
              interrogation: {
                ...interrogationData,
                isAnswered: false,
              },
              risks: undefined,
              idea_synthesis: synthesis,
              currentStep: 2,
            });
            setLoading(false);
            return;
          } else if (synthesis.analysis.recommendation === "pursue_separately") {
            // User will need to select which idea to pursue
            // Save synthesis and wait for user selection
            saveState({
              ...state,
              raw_ideas: ideas,
              idea_synthesis: synthesis,
            });
            setLoading(false);
            return;
          } else {
            // conflicts_resolve_first - default to first idea for now
            parsedIdea = synthesis.original_ideas[0].parsed;
            setLoadingLabel("Generating interrogation...");
            const interrogationData = await runP2InterrogateGenerate(parsedIdea);
            saveState({
              ...state,
              raw_ideas: ideas,
              parsedIdea,
              interrogation: {
                ...interrogationData,
                isAnswered: false,
              },
              risks: undefined,
              idea_synthesis: synthesis,
              currentStep: 2,
            });
            setLoading(false);
            return;
          }
        } else {
          // Single idea flow
          const parsed = await runP1Intake(ideas[0]);
          parsedIdea = parsed;
          setLoadingLabel("Generating interrogation...");
          const interrogationData = await runP2InterrogateGenerate(parsed);
          saveState({
            ...state,
            raw_ideas: ideas,
            parsedIdea,
            interrogation: {
              ...interrogationData,
              isAnswered: false,
            },
            risks: undefined,
            currentStep: 2,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed during intake analysis.");
        setRetryAction({
          label: "Retry Idea Intake",
          action: () => handleIntakeSubmit(ideas),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Continue after alignment report review
  const handleAlignmentContinue = () => {
    saveState({
      ...state,
      currentStep: 1, // Move to P1 Intake
    });
  };

  // Continue after idea synthesis: select which idea to pursue
  const handleIdeaSelection = async (selectedIndex: number) => {
    if (!state.idea_synthesis) return;

    setError(null);
    setLoading(true);
    setLoadingLabel("Generating interrogation...");

    const execute = async () => {
      try {
        const selectedIdea = state.idea_synthesis!.original_ideas[selectedIndex].parsed;
        const interrogationData = await runP2InterrogateGenerate(selectedIdea);

        saveState({
          ...state,
          parsedIdea: selectedIdea,
          interrogation: {
            ...interrogationData,
            isAnswered: false,
          },
          risks: undefined,
          currentStep: 2,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate interrogation for selected idea.");
        setRetryAction({
          label: "Retry Idea Selection",
          action: () => handleIdeaSelection(selectedIndex),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Continue after idea synthesis: merge as one
  const handleIdeaMerge = () => {
    if (!state.idea_synthesis?.analysis.unified_idea) return;

    const unifiedIdea = state.idea_synthesis.analysis.unified_idea;

    setError(null);
    setLoading(true);
    setLoadingLabel("Generating interrogation...");

    const execute = async () => {
      try {
        const interrogationData = await runP2InterrogateGenerate(unifiedIdea);

        saveState({
          ...state,
          parsedIdea: unifiedIdea,
          interrogation: {
            ...interrogationData,
            isAnswered: false,
          },
          risks: undefined,
          currentStep: 2,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate interrogation for unified idea.");
        setRetryAction({
          label: "Retry Idea Merge",
          action: handleIdeaMerge,
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Stage 2 Interrogation Action: Submit Answers -> Generate Risks
  const handleInterrogationSubmit = async (answeredItems: InterrogationItem[]) => {
    if (!state.parsedIdea || !state.interrogation) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Analyzing answers & mapping risks...");

    const execute = async () => {
      try {
        const risks = await runP2Risks(
          state.parsedIdea!,
          answeredItems,
          state.profiles[0]
        );

        saveState({
          ...state,
          risks,
          interrogation: {
            ...state.interrogation!,
            items: answeredItems,
            isAnswered: true,
          },
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to analyze answers and generate risks.");
        setRetryAction({
          label: "Retry Risk Generation",
          action: () => handleInterrogationSubmit(answeredItems),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // P2: Risks -> P3
  const handleRisksNext = async () => {
    if (!state.parsedIdea || !state.risks) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Analyzing strategic postures...");

    const execute = async () => {
      try {
        const postures = await runP3Postures(state.parsedIdea!, state.risks!, state.profiles[0]);
        saveState({
          ...state,
          postures,
          currentStep: 3,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate strategic postures.");
        setRetryAction({
          label: "Retry Posture Generation",
          action: handleRisksNext,
        });
        setLoading(false);
      }
    };

    execute();
  };

  // P3: Posture selection -> P4
  const handlePostureConfirm = async (chosen: PostureOption) => {
    setError(null);
    setLoading(true);
    setLoadingLabel("Synthesizing execution roadmap...");

    const execute = async () => {
      try {
        const roadmap = await runP4Synthesis(
          state.parsedIdea!,
          state.risks!,
          state.postures!,
          state.profiles[0],
          chosen.posture,
        );
        saveState({
          ...state,
          chosenPosture: chosen,
          roadmap,
          currentStep: 4,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to synthesize roadmap.");
        setRetryAction({
          label: "Retry Roadmap Synthesis",
          action: () => handlePostureConfirm(chosen),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // P3: Branching mode - generate all 3 branches in parallel
  const handleBranchingMode = async () => {
    if (!state.postures || !state.parsedIdea || !state.risks) return;

    setError(null);
    setLoading(true);
    setLoadingLabel("Generating branch roadmaps...");

    const execute = async () => {
      try {
        // Generate roadmaps for all 3 postures in parallel
        const branchPromises = state.postures!.options.map(async (postureOption) => {
          const roadmap = await runP4Synthesis(
            state.parsedIdea!,
            state.risks!,
            state.postures!,
            state.profiles[0],
            postureOption.posture,
          );

          // Generate experiments for this branch
          const experiments = await runP5Gate(
            roadmap,
            postureOption.posture,
            state.profiles[0],
          );

          return {
            id: `branch-${postureOption.posture}`,
            name: postureOption.name,
            color:
              postureOption.posture === StrategicPosture.SHIP_FAST
                ? '#C1440E'
                : postureOption.posture === StrategicPosture.BUILD_MOAT
                ? '#2563EB'
                : '#059669',
            posture: postureOption,
            roadmap,
            experiments,
            created_at: new Date().toISOString(),
          };
        });

        const branches = await Promise.all(branchPromises);

        // Create versioning state
        const versioningState: VersioningState = {
          branches,
          active_branch_id: branches[0]?.id,
          merge_history: [],
          is_branching_mode: true,
        };

        // Save state and advance to versioning diff view
        saveState({
          ...state,
          versioning: versioningState,
          currentStep: 3.5, // Intermediate step for versioning diff
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate branch roadmaps.");
        setRetryAction({
          label: "Retry Branch Generation",
          action: handleBranchingMode,
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Switch between branches
  const handleBranchSelect = (branchId: string) => {
    if (!state.versioning) return;

    saveState({
      ...state,
      versioning: {
        ...state.versioning,
        active_branch_id: branchId,
      },
    });
  };

  // Merge selected phases from different branches
  const handleMergeSelection = async (phaseSelection: MergePhaseSelection) => {
    if (!state.versioning || !state.versioning.branches) return;

    setError(null);
    setLoading(true);
    setLoadingLabel("Merging roadmaps...");

    const execute = async () => {
      try {
        const { roadmap, rationale } = await runP4MergeSynthesis(
          state.versioning!.branches,
          phaseSelection,
        );

        // Generate experiments for merged roadmap
        const mergedPosture = state.versioning!.branches.find(
          (b) => b.id === phaseSelection.day30_branch_id
        )?.posture;

        if (!mergedPosture) {
          throw new Error('Could not determine posture for merged roadmap');
        }

        const experiments = await runP5Gate(
          roadmap,
          mergedPosture.posture,
          state.profiles[0],
        );

        // Create merge point record
        const mergePoint = {
          id: `merge-${Date.now()}`,
          from_branch_ids: Array.from(new Set(Object.values(phaseSelection))) as string[],
          merged_roadmap: roadmap,
          rationale,
          created_at: new Date().toISOString(),
        };

        // Save merged state and advance to roadmap view
        saveState({
          ...state,
          versioning: {
            ...state.versioning!,
            merge_history: [...state.versioning!.merge_history, mergePoint],
          },
          chosenPosture: mergedPosture,
          roadmap,
          experiments,
          currentStep: 4,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to merge roadmaps.");
        setRetryAction({
          label: "Retry Merge",
          action: () => handleMergeSelection(phaseSelection),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Continue with single branch (skip merge)
  const handleSingleBranchContinue = (branchId: string) => {
    if (!state.versioning) return;

    const selectedBranch = state.versioning.branches.find((b) => b.id === branchId);
    if (!selectedBranch) return;

    saveState({
      ...state,
      chosenPosture: selectedBranch.posture,
      roadmap: selectedBranch.roadmap,
      experiments: selectedBranch.experiments,
      currentStep: 4,
    });
  };

  // P4: Roadmap -> P5
  const handleRoadmapNext = async () => {
    if (!state.roadmap || !state.chosenPosture) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Generating experiments...");

    const execute = async () => {
      try {
        const experiments = await runP5Gate(
          state.roadmap!,
          state.chosenPosture!.posture,
          state.profiles[0],
        );
        saveState({
          ...state,
          experiments,
          currentStep: 5,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate experiments.");
        setRetryAction({
          label: "Retry Experiment Generation",
          action: handleRoadmapNext,
        });
        setLoading(false);
      }
    };

    execute();
  };

  // P5: Gate Choice -> P6/P7/P8
  const handleExperimentSelect = async (experiment: CandidateExperiment) => {
    if (!state.parsedIdea || !state.chosenPosture) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Matching resources...");

    const execute = async () => {
      try {
        const cats = await runP6ResourceMapping(experiment);
        const matched = await runP7ResourceRetrieval(cats);

        setLoadingLabel("Drafting your first step...");
        const draft = await runP8MicroActionDraft(
          state.parsedIdea!,
          experiment,
          state.profiles[0],
          state.chosenPosture!.posture,
        );

        saveState({
          ...state,
          selectedExperiment: experiment,
          supportCategories: cats,
          matchedResources: matched,
          microActionDraft: draft,
          currentStep: 6,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to match resources and draft micro-action.");
        setRetryAction({
          label: "Retry Resource Mapping & Drafting",
          action: () => handleExperimentSelect(experiment),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Experiment Logging
  const handleExperimentLog = async (log: Omit<ExperimentLog, 'id' | 'started_at'>) => {
    if (!state.experiment_logs) {
      saveState({
        ...state,
        experiment_logs: [],
      });
    }

    const newLog: ExperimentLog = {
      ...log,
      id: `log-${Date.now()}`,
      started_at: new Date().toISOString(),
    };

    const updatedLogs = [...(state.experiment_logs || []), newLog];

    // Trigger re-risk analysis after 3+ logs
    if (updatedLogs.length >= 3 && state.parsedIdea && state.risks) {
      setError(null);
      setLoading(true);
      setLoadingLabel("Re-analyzing risks with experiment data...");

      try {
        const updatedRisks = await runP9ReRiskAnalysis(state.risks!, updatedLogs, state.parsedIdea!);

        // Trigger pivot detection
        const pivotSuggestion = await runP10PivotDetection(updatedRisks, updatedLogs);

        saveState({
          ...state,
          experiment_logs: updatedLogs,
          updated_risks: updatedRisks,
          pivot_suggestion: pivotSuggestion,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to analyze experiment results.");
        setRetryAction({
          label: "Retry Experiment Analysis",
          action: () => handleExperimentLog(log),
        });
        setLoading(false);
      }
    } else {
      // Just save the log
      saveState({
        ...state,
        experiment_logs: updatedLogs,
      });
    }
  };

  // Dismiss pivot suggestion
  const handleDismissPivot = () => {
    saveState({
      ...state,
      pivot_suggestion: undefined,
    });
  };

  // Request manual re-analysis
  const handleRequestReAnalysis = async () => {
    if (!state.experiment_logs || !state.parsedIdea || !state.risks) return;

    setError(null);
    setLoading(true);
    setLoadingLabel("Re-analyzing risks...");

    try {
      const updatedRisks = await runP9ReRiskAnalysis(state.risks!, state.experiment_logs, state.parsedIdea!);
      const pivotSuggestion = await runP10PivotDetection(updatedRisks, state.experiment_logs);

      saveState({
        ...state,
        updated_risks: updatedRisks,
        pivot_suggestion: pivotSuggestion,
      });
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to re-analyze risks.");
      setLoading(false);
    }
  };

  // Stepper: 8 stages (P0–P7)
  const steps = [
    { code: "P0", label: "Founder Profile" },
    { code: "P1", label: "Idea Intake" },
    { code: "P2", label: "Risk Register" },
    { code: "P3", label: "Strategic Posture" },
    { code: "P4", label: "Milestone Synthesis" },
    { code: "P5", label: "Experiment Gate" },
    { code: "P6", label: "Resource Mapping" },
    { code: "P7", label: "Launchpad" },
  ];

  const activeStepperIndex =
    state.currentStep === 6
      ? 7 // Launchpad
      : state.currentStep === 5 && loading && loadingLabel === "Matching resources..."
      ? 6 // Resource Mapping loading
      : state.currentStep;

  return (
    <div className="flex flex-col md:flex-row gap-12 w-full max-w-[960px] items-start px-4">
      {/* Left Stepper Column */}
      <div className="w-full md:w-56 md:flex-shrink-0 md:sticky md:top-8 bg-[#EDEDEA]/40 p-4 rounded-lg border border-stone-300/10">
        <Stepper currentStep={activeStepperIndex} steps={steps} />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 w-full max-w-[680px] mx-auto min-h-[400px]">
        {/* Loading Overlay */}
        {loading ? (
          <div className="space-y-8 fade-in w-full py-12">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-2xl font-headline italic text-primary mt-2">{loadingLabel}</h3>
              <p className="text-xs text-[#1A1A1A]/60 font-body">Please wait while the AI process executes...</p>
            </div>
            <div className="space-y-4 pt-6">
              <div className="h-5 rounded-md shimmer-loader w-3/4 mx-auto" />
              <div className="h-28 rounded-xl shimmer-loader w-full" />
              <div className="h-28 rounded-xl shimmer-loader w-full" />
            </div>
          </div>
        ) : error ? (
          /* Error State UI */
          <div className="p-6 bg-[#FEF3C7]/60 border border-[#D97706]/35 rounded-xl space-y-4 fade-in max-w-md mx-auto text-center">
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-[#D97706]" />
            </div>
            <h3 className="text-xl font-headline text-[#1A1A1A] font-semibold">An Error Occurred</h3>
            <p className="text-sm text-[#1A1A1A]/80 font-body leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {retryAction && (
                <Button
                  onClick={retryAction.action}
                  className="bg-primary hover:bg-primary/95 text-white font-body"
                >
                  Try Again
                </Button>
              )}
              <Button
                variant="outline"
                onClick={resetApp}
                className="border-stone-300 hover:bg-stone-200/50 font-body text-stone-700"
              >
                Reset Project
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Stepped Rendering */
          <div className="w-full">
            {/* Show alignment report if multiple founders and alignment analysis exists */}
            {state.currentStep === 0 && state.alignment && state.profiles.length >= 2 && (
              <StageAlignmentReport
                alignment={state.alignment}
                onContinue={handleAlignmentContinue}
                isLoading={loading}
              />
            )}

            {/* P0: Profile stage (or show alignment first if multi-founder) */}
            {state.currentStep === 0 && (!state.alignment || state.profiles.length < 2) && (
              <StageProfile
                onSubmit={handleProfileSubmit}
                isLoading={loading}
              />
            )}

            {/* Show idea synthesis if multiple ideas with pursue_separately recommendation */}
            {state.currentStep === 1 && state.idea_synthesis &&
             state.idea_synthesis.analysis.recommendation === 'pursue_separately' && (
              <StageIdeaSynthesis
                synthesis={state.idea_synthesis}
                onMerge={handleIdeaMerge}
                onPursueSeparately={handleIdeaSelection}
                isLoading={loading}
              />
            )}

            {/* P1: Intake stage (or show synthesis first if multi-idea with conflicts) */}
            {state.currentStep === 1 && (!state.idea_synthesis ||
             state.idea_synthesis.analysis.recommendation !== 'pursue_separately') && (
              <StageIntake
                onSubmit={handleIntakeSubmit}
                isLoading={loading}
                lastIdeaTitle={savedStateToRestore?.parsedIdea?.title}
                onRestoreLastIdea={handleRestoreState}
              />
            )}
            {state.currentStep === 2 && (
              <StageRisks
                idea={state.parsedIdea}
                risks={state.risks}
                interrogation={state.interrogation}
                onInterrogateSubmit={handleInterrogationSubmit}
                onNext={handleRisksNext}
                isLoading={loading}
              />
            )}
            {state.currentStep === 3 && state.postures && (
              <StagePosture
                postures={state.postures}
                onConfirm={handlePostureConfirm}
                onBranchingMode={handleBranchingMode}
                isLoading={loading}
              />
            )}
            {/* Show versioning diff if in branching mode */}
            {state.currentStep === 3.5 && state.versioning && state.versioning.branches && (
              <StageVersioningDiff
                branches={state.versioning.branches}
                onMerge={handleMergeSelection}
                onBranchSelect={handleBranchSelect}
                activeBranchId={state.versioning.active_branch_id}
                isLoading={loading}
              />
            )}
            {state.currentStep === 4 && (
              <StageRoadmap
                roadmap={state.roadmap}
                onNext={handleRoadmapNext}
                isLoading={loading}
              />
            )}
            {state.currentStep === 5 && state.experiments && (
              <StageTheGate
                experiments={state.experiments}
                onSelect={handleExperimentSelect}
                isLoading={loading}
              />
            )}
            {state.currentStep === 6 && state.selectedExperiment && (
              <>
                <StageResources
                  idea={state.parsedIdea}
                  chosenExperiment={state.selectedExperiment}
                  roadmap={state.roadmap}
                  matched={state.matchedResources}
                  draft={state.microActionDraft}
                  profile={state.profiles[0]}
                  onReset={resetApp}
                  updatedRisks={state.updated_risks}
                  pivotSuggestion={state.pivot_suggestion}
                  onDismissPivot={handleDismissPivot}
                />

                {/* Experiment Tracker */}
                <div className="mt-8">
                  <StageExperimentTracker
                    experimentName={state.selectedExperiment.name}
                    experimentId={state.selectedExperiment.id}
                    existingLogs={state.experiment_logs}
                    onLogSubmit={handleExperimentLog}
                    isLoading={loading}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}