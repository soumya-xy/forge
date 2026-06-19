"use client";

import { useState, useEffect } from "react";
import { IdeaJSON, RiskRegister, FounderScenarios, MilestonePlan, CandidateExperiment, ResourceItem, MicroActionDraft } from "@/types/types";
import { ResourceCategory } from "@/types/enums";

import { runP1Intake } from "@/pipeline/p1Intake";
import { runP2Risks } from "@/pipeline/p2Risks";
import { runP3Scenarios } from "@/pipeline/p3Scenarios";
import { runP4Synthesis } from "@/pipeline/p4Synthesis";
import { runP5Gate } from "@/pipeline/p5Gate";
import { runP6ResourceMapping } from "@/pipeline/p6ResourceMapping";
import { runP7ResourceRetrieval } from "@/pipeline/p7ResourceRetrieval";
import { runP8MicroActionDraft } from "@/pipeline/p8MicroActionDraft";

import StageIntake from "./stages/StageIntake";
import StageRisks from "./stages/StageRisks";
import StageScenarios from "./stages/StageScenarios";
import StageRoadmap from "./stages/StageRoadmap";
import StageTheGate from "./stages/StageTheGate";
import StageResources from "./stages/StageResources";
import Stepper from "./ui/Stepper";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

const LOCAL_STORAGE_KEY = "forge-state-v1";

interface AppState {
  ideaDescription: string;
  parsedIdea?: IdeaJSON;
  risks?: RiskRegister;
  scenarios?: FounderScenarios;
  roadmap?: MilestonePlan;
  experiments?: CandidateExperiment[];
  selectedExperiment?: CandidateExperiment;
  supportCategories?: ResourceCategory[];
  matchedResources?: ResourceItem[];
  microActionDraft?: MicroActionDraft;
  currentStep: number;
}

export default function ForgeApp() {
  const [state, setState] = useState<AppState>({
    ideaDescription: "",
    currentStep: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<{ label: string; action: () => void } | null>(null);
  const [savedStateToRestore, setSavedStateToRestore] = useState<AppState | null>(null);

  // Load from localStorage (D1 Session State)
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        if (parsed && parsed.parsedIdea) {
          setSavedStateToRestore(parsed);
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
      setState({ ideaDescription: "", currentStep: 0 });
      setSavedStateToRestore(null);
      setError(null);
      setRetryAction(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Stage 1 Action: Intake
  const handleIntakeSubmit = async (idea: string) => {
    setError(null);
    setLoading(true);
    setLoadingLabel("Parsing idea...");

    const execute = async () => {
      try {
        const parsed = await runP1Intake(idea);
        setLoadingLabel("Mapping risks...");
        const risks = await runP2Risks(parsed);
        
        saveState({
          ...state,
          ideaDescription: idea,
          parsedIdea: parsed,
          risks,
          currentStep: 1,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed during intake analysis.");
        setRetryAction({
          label: "Retry Idea Intake",
          action: () => handleIntakeSubmit(idea),
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Stage 2 Action: Risks -> Scenarios
  const handleRisksNext = async () => {
    if (!state.parsedIdea || !state.risks) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Building scenarios...");

    const execute = async () => {
      try {
        const scenarios = await runP3Scenarios(state.parsedIdea!, state.risks!);
        saveState({
          ...state,
          scenarios,
          currentStep: 2,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate founder scenarios.");
        setRetryAction({
          label: "Retry Strategic Personas",
          action: handleRisksNext,
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Stage 3 Action: Scenarios -> Roadmap
  const handleScenariosNext = async () => {
    if (!state.parsedIdea || !state.risks || !state.scenarios) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Synthesizing plan...");

    const execute = async () => {
      try {
        const roadmap = await runP4Synthesis(state.parsedIdea!, state.risks!, state.scenarios!);
        saveState({
          ...state,
          roadmap,
          currentStep: 3,
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to synthesize roadmap.");
        setRetryAction({
          label: "Retry Roadmap Synthesis",
          action: handleScenariosNext,
        });
        setLoading(false);
      }
    };

    execute();
  };

  // Stage 4 Action: Roadmap -> Experiments Gate
  const handleRoadmapNext = async () => {
    if (!state.roadmap) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Generating experiments...");

    const execute = async () => {
      try {
        const experiments = await runP5Gate(state.roadmap!);
        saveState({
          ...state,
          experiments,
          currentStep: 4,
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

  // Stage 5 Action: Gate Choice -> Resource mapping & retrieval & first step generation
  const handleExperimentSelect = async (experiment: CandidateExperiment) => {
    if (!state.parsedIdea) return;
    setError(null);
    setLoading(true);
    setLoadingLabel("Matching resources...");

    const execute = async () => {
      try {
        const cats = await runP6ResourceMapping(experiment);
        const matched = await runP7ResourceRetrieval(cats);

        setLoadingLabel("Drafting your first step...");
        const draft = await runP8MicroActionDraft(state.parsedIdea!, experiment);

        saveState({
          ...state,
          selectedExperiment: experiment,
          supportCategories: cats,
          matchedResources: matched,
          microActionDraft: draft,
          currentStep: 5,
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

  // Stepper Stage Items mapping P1 to P7
  const steps = [
    { code: "P1", label: "Idea Intake" },
    { code: "P2", label: "Risk Register" },
    { code: "P3", label: "Strategic Personas" },
    { code: "P4", label: "Milestone Synthesis" },
    { code: "P5", label: "Experiment Gate" },
    { code: "P6", label: "Resource Mapping" },
    { code: "P7", label: "Launchpad" },
  ];

  // Active step calculation for the 7 stages stepper
  // If currentStep is 5 (Launchpad), it means we have resolved P6 and P7.
  const activeStepperIndex = 
    state.currentStep === 5 
      ? 6 // Launchpad
      : state.currentStep === 4 && loading && loadingLabel === "Matching resources..."
      ? 5 // Resource Mapping loading
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
            {state.currentStep === 0 && (
              <StageIntake 
                onSubmit={handleIntakeSubmit} 
                isLoading={loading} 
                lastIdeaTitle={savedStateToRestore?.parsedIdea?.title}
                onRestoreLastIdea={handleRestoreState}
              />
            )}
            {state.currentStep === 1 && (
              <StageRisks 
                idea={state.parsedIdea} 
                risks={state.risks} 
                onNext={handleRisksNext} 
                isLoading={loading} 
              />
            )}
            {state.currentStep === 2 && (
              <StageScenarios 
                scenarios={state.scenarios} 
                onNext={handleScenariosNext} 
                isLoading={loading} 
              />
            )}
            {state.currentStep === 3 && (
              <StageRoadmap 
                roadmap={state.roadmap} 
                onNext={handleRoadmapNext} 
                isLoading={loading} 
              />
            )}
            {state.currentStep === 4 && state.experiments && (
              <StageTheGate 
                experiments={state.experiments} 
                onSelect={handleExperimentSelect} 
                isLoading={loading} 
              />
            )}
            {state.currentStep === 5 && (
              <StageResources 
                idea={state.parsedIdea}
                chosenExperiment={state.selectedExperiment}
                roadmap={state.roadmap}
                matched={state.matchedResources} 
                draft={state.microActionDraft}
                onReset={resetApp} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}