"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex justify-between items-center mb-10 w-full px-4 overflow-x-auto no-scrollbar">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;

        return (
          <div key={step} className="flex flex-col items-center flex-1 min-w-[70px]">
            <div className="flex items-center w-full">
              <div 
                className={cn(
                  "flex-1 h-[1px] transition-colors duration-500",
                  idx === 0 ? "bg-transparent" : (isCompleted || isActive ? "bg-primary" : "bg-border")
                )} 
              />
              <div 
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-500",
                  isActive ? "bg-primary scale-125 ring-4 ring-primary/20" : 
                  (isCompleted ? "bg-primary" : "bg-border")
                )} 
              />
              <div 
                className={cn(
                  "flex-1 h-[1px] transition-colors duration-500",
                  idx === steps.length - 1 ? "bg-transparent" : (isCompleted ? "bg-primary" : "bg-border")
                )} 
              />
            </div>
            <span 
              className={cn(
                "mt-2 text-[10px] font-medium uppercase tracking-widest transition-colors duration-500",
                isActive ? "text-primary" : (isCompleted ? "text-primary/70" : "text-muted-foreground")
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}