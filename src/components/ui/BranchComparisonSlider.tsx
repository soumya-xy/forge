"use client";

import { useState } from "react";
import { MilestonePlan, IdeaBranch } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, GitBranch } from "lucide-react";

interface BranchComparisonSliderProps {
  branches: IdeaBranch[];
  onMergeRequest?: (selectedBranchIds: string[]) => void;
}

export default function BranchComparisonSlider({
  branches,
  onMergeRequest,
}: BranchComparisonSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextBranch = () => {
    if (currentIndex < branches.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const prevBranch = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const currentBranch = branches[currentIndex];
  const nextBranchData = branches[currentIndex + 1];
  const prevBranchData = branches[currentIndex - 1];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-slate-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-headline">
                Branch Comparison
              </h3>
              <p className="text-sm text-slate-600 font-body">
                {currentIndex + 1} of {branches.length} branches
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prevBranch}
              disabled={currentIndex === 0}
              className={`p-2 rounded-lg transition-all ${
                currentIndex === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300"
              }`}
              whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={nextBranch}
              disabled={currentIndex === branches.length - 1}
              className={`p-2 rounded-lg transition-all ${
                currentIndex === branches.length - 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300"
              }`}
              whileHover={currentIndex < branches.length - 1 ? { scale: 1.05 } : {}}
              whileTap={currentIndex < branches.length - 1 ? { scale: 0.95 } : {}}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Branch Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {branches.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-primary"
                  : i < currentIndex
                  ? "bg-primary/30"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Branch Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentBranch.color }}
                  />
                  <h4 className="text-2xl font-bold text-slate-900 font-headline">
                    {currentBranch.name}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 font-body">
                  Posture: {currentBranch.posture.name}
                </p>
              </div>

              {/* Select for Merge Checkbox */}
              {onMergeRequest && (
                <motion.button
                  onClick={() => onMergeRequest([currentBranch.id])}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium font-body hover:bg-primary/90 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Select Branch
                </motion.button>
              )}
            </div>

            {/* Milestone Comparison Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Day 30 */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700 font-body">
                    Day 30
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 font-headline mb-2">
                  {currentBranch.roadmap.day30.focus}
                </p>
                <p className="text-xs text-slate-600 font-body line-clamp-3">
                  {currentBranch.roadmap.day30.milestones.slice(0, 2).join("; ")}
                </p>

                {/* Diff Indicator */}
                {prevBranchData && (
                  <div className="mt-3 pt-3 border-t border-slate-300">
                    <span className="text-xs text-slate-500 font-body">
                      vs {prevBranchData.name}:
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {currentBranch.roadmap.day30.focus !==
                        prevBranchData.roadmap.day30.focus ? (
                        <>
                          <span className="text-xs text-green-600 font-medium">
                            ✓ New focus
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">Same focus</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Day 60 */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700 font-body">
                    Day 60
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 font-headline mb-2">
                  {currentBranch.roadmap.day60.focus}
                </p>
                <p className="text-xs text-slate-600 font-body line-clamp-3">
                  {currentBranch.roadmap.day60.milestones.slice(0, 2).join("; ")}
                </p>

                {/* Diff Indicator */}
                {prevBranchData && (
                  <div className="mt-3 pt-3 border-t border-slate-300">
                    <span className="text-xs text-slate-500 font-body">
                      vs {prevBranchData.name}:
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {currentBranch.roadmap.day60.focus !==
                        prevBranchData.roadmap.day60.focus ? (
                        <>
                          <span className="text-xs text-green-600 font-medium">
                            ✓ New focus
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">Same focus</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Day 90 */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700 font-body">
                    Day 90
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 font-headline mb-2">
                  {currentBranch.roadmap.day90.focus}
                </p>
                <p className="text-xs text-slate-600 font-body line-clamp-3">
                  {currentBranch.roadmap.day90.milestones.slice(0, 2).join("; ")}
                </p>

                {/* Diff Indicator */}
                {prevBranchData && (
                  <div className="mt-3 pt-3 border-t border-slate-300">
                    <span className="text-xs text-slate-500 font-body">
                      vs {prevBranchData.name}:
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {currentBranch.roadmap.day90.focus !==
                        prevBranchData.roadmap.day90.focus ? (
                        <>
                          <span className="text-xs text-green-600 font-medium">
                            ✓ New focus
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">Same focus</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experiments Preview */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
              <h5 className="text-sm font-bold text-slate-900 font-headline mb-3">
                Key Experiments
              </h5>
              <div className="space-y-2">
                {currentBranch.experiments.slice(0, 2).map((exp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900 font-body">
                        {exp.name}
                      </p>
                      <p className="text-xs text-slate-600 font-body line-clamp-1">
                        {exp.hypothesis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
