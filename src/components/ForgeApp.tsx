"use client";

import { useState, useEffect } from "react";
import { 
  IdeaIntakeParserOutput, ideaIntakeParser 
} from "@/ai/flows/idea-intake-parser";
import { 
  AutomatedRiskRegisterOutput, identifyRisks 
} from "@/ai/flows/automated-risk-register";
import { 
  GenerateFounderScenariosOutput, generateFounderScenarios 
} from "@/ai/flows/scenario-persona-tool";
import { 
  MilestoneSynthesisToolOutput, synthesizeMilestones 
} from "@/ai/flows/milestone-synthesis-tool";
import { 
  ResourceMappingToolOutput, resourceMappingTool 
} from "@/ai/flows/resource-mapping-tool-flow";
import { STATIC_RESOURCES, ResourceItem } from "@/lib/resources-data";

import StageIntake from "./stages/StageIntake";
import StageAnalysis from "./stages/StageAnalysis";
import StageScenarios from "./stages/StageScenarios";
import StageRoadmap from "./stages/StageRoadmap";
import StageTheGate from "./stages/StageTheGate";
import StageResources from "./stages/StageResources";
import Stepper from "./ui/Stepper";

const LOCAL_STORAGE_KEY = "forge-state";

export default function ForgeApp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<{
    ideaDescription: string;
    parsedIdea?: IdeaIntakeParserOutput;
    risks?: AutomatedRiskRegisterOutput;
    scenarios?: GenerateFounderScenariosOutput;
    roadmap?: MilestoneSynthesisToolOutput;
    selectedExperiment?: any;
    supportCategories?: string[];
    matchedResources?: ResourceItem[];
  }>({
    ideaDescription: "",
  });

  // Hydrate state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed.state);
        setCurrentStep(parsed.currentStep);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ state, currentStep }));
  }, [state, currentStep]);

  const resetApp = () => {
    if (confirm("Are you sure you want to reset? This will clear all progress.")) {
      setState({ ideaDescription: "" });
      setCurrentStep(0);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleIntakeSubmit = async (idea: string) => {
    setLoading(true);
    try {
      const parsed = await ideaIntakeParser({ ideaDescription: idea });
      const risks = await identifyRisks({
        problems: parsed.coreProblems,
        targetUsers: parsed.targetUsers.join(", "),
        keyAssumptions: parsed.keyAssumptions,
      });
      setState((prev) => ({ ...prev, ideaDescription: idea, parsedIdea: parsed, risks }));
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisNext = async () => {
    if (!state.parsedIdea) return;
    setLoading(true);
    try {
      const scenarios = await generateFounderScenarios({
        problemStatement: state.parsedIdea.coreProblems[0],
        targetUsers: state.parsedIdea.targetUsers,
        keyAssumptions: state.parsedIdea.keyAssumptions,
      });
      setState((prev) => ({ ...prev, scenarios }));
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenariosNext = async () => {
    if (!state.parsedIdea) return;
    setLoading(true);
    try {
      const roadmap = await synthesizeMilestones({
        ideaDescription: state.ideaDescription,
        coreProblem: state.parsedIdea.coreProblems[0],
        targetUsers: state.parsedIdea.targetUsers,
        keyAssumptions: state.parsedIdea.keyAssumptions,
      });
      setState((prev) => ({ ...prev, roadmap }));
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapNext = () => {
    setCurrentStep(4);
  };

  const handleExperimentSelect = async (experiment: any) => {
    setLoading(true);
    try {
      const mapping = await resourceMappingTool({
        experimentDescription: experiment.milestone,
        experimentGoal: experiment.actions[0],
        testableAssumption: experiment.testableAssumptions[0],
      });
      
      const cats = mapping.supportCategories;
      const matched = STATIC_RESOURCES.filter(r => cats.includes(r.category));

      setState((prev) => ({ 
        ...prev, 
        selectedExperiment: experiment, 
        supportCategories: cats,
        matchedResources: matched 
      }));
      setCurrentStep(5);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { title: "Intake", component: <StageIntake onSubmit={handleIntakeSubmit} isLoading={loading} /> },
    { title: "Analysis", component: <StageAnalysis data={state.parsedIdea} risks={state.risks} onNext={handleAnalysisNext} isLoading={loading} /> },
    { title: "Strategy", component: <StageScenarios scenarios={state.scenarios} onNext={handleScenariosNext} isLoading={loading} /> },
    { title: "Roadmap", component: <StageRoadmap roadmap={state.roadmap} onNext={handleRoadmapNext} /> },
    { title: "The Gate", component: <StageTheGate milestones={state.roadmap?.day30} onSelect={handleExperimentSelect} isLoading={loading} /> },
    { title: "Resources", component: <StageResources matched={state.matchedResources} onReset={resetApp} /> },
  ];

  return (
    <div className="space-y-8 pb-20">
      <Stepper currentStep={currentStep} steps={stages.map(s => s.title)} />
      <div className="fade-in">
        {stages[currentStep]?.component}
      </div>
    </div>
  );
}