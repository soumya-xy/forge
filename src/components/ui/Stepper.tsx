"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  steps: { code: string; label: string }[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div>
      {/* Mobile Top Progress Bar */}
      <div className="md:hidden w-full space-y-2 mb-6">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">
          <span>Stage {currentStep + 1} of {steps.length}</span>
          <span className="text-primary">{steps[currentStep]?.label}</span>
        </div>
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Vertical Stepper */}
      <div className="hidden md:flex flex-col space-y-6 relative border-l border-stone-300 pl-6 py-2">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;

          return (
            <div 
              key={step.code} 
              className={cn(
                "relative flex items-start gap-4 transition-all duration-300",
                isActive ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40"
              )}
            >
              {/* Stepper Dot */}
              <div 
                className={cn(
                  "absolute -left-[31px] w-2.5 h-2.5 rounded-full border transition-all duration-500 bg-background",
                  isActive ? "bg-primary border-primary scale-125 ring-4 ring-primary/20" : 
                  (isCompleted ? "bg-primary border-primary" : "border-stone-400 bg-background")
                )} 
              />
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                  {step.code}
                </span>
                <span 
                  className={cn(
                    "text-xs font-semibold font-body mt-0.5",
                    isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/70"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}