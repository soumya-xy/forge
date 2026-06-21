"use client";

import { IdeaJSON } from "@/types/types";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface RelationshipMapProps {
  ideas: IdeaJSON[];
  analysis: {
    core_bet: string;
    conflicts: string[];
    complementarity: string[];
  };
}

export default function IdeaRelationshipMap({
  ideas,
  analysis,
}: RelationshipMapProps) {
  const positions = ideas.map((_, i) => {
    const angle = (i * 120) * (Math.PI / 180); // 120 degrees apart for 3 ideas
    const radius = 120;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
      {/* Warning Banner - Top of container */}
      {analysis.conflicts.length > 0 && analysis.complementarity.length > 0 && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-amber-50 px-4 py-3 border-b border-amber-200"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-xs font-medium text-amber-900 font-body">
              Mixed signals detected - Review carefully
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Map Container */}
      <div className="relative h-[350px]">
        {/* Core Bet - Center */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg border-2 border-primary max-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-body">
                Core Bet
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 font-headline leading-tight">
              {analysis.core_bet}
            </p>
          </div>
        </motion.div>

      {/* Idea Nodes */}
      {ideas.map((idea, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="absolute z-10"
          style={{
            left: `calc(50% + ${positions[i].x}px - 80px)`,
            top: `calc(50% + ${positions[i].y}px - 60px)`,
          }}
        >
          <div className="bg-white px-4 py-3 rounded-lg shadow-md border-2 border-slate-300 w-[160px]">
            <p className="text-sm font-bold text-gray-900 font-headline mb-1 line-clamp-2">
              {idea.title}
            </p>
            <p className="text-xs text-gray-600 font-body line-clamp-1">
              {idea.core_problem.substring(0, 40)}...
            </p>
          </div>

          {/* Connector line to center */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.line
              x1="50%"
              y1="50%"
              x2={positions[i].x < 0 ? "0%" : positions[i].x > 0 ? "100%" : "50%"}
              y2={positions[i].y < 0 ? "0%" : positions[i].y > 0 ? "100%" : "50%"}
              stroke={i < analysis.conflicts.length ? "#EF4444" : "#10B981"}
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Conflicts Legend */}
      {analysis.conflicts.length > 0 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-4 left-4 bg-red-50 px-3 py-2 rounded-lg border border-red-200 shadow-md z-30 max-w-[200px]"
        >
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs font-bold text-red-900 font-headline">
              {analysis.conflicts.length} Conflict{analysis.conflicts.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-red-800 font-body line-clamp-2 leading-tight">
            {analysis.conflicts[0]}
          </p>
        </motion.div>
      )}

      {/* Complementarity Legend */}
      {analysis.complementarity.length > 0 && (
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="absolute bottom-4 right-4 bg-green-50 px-3 py-2 rounded-lg border border-green-200 shadow-md z-30 max-w-[200px]"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs font-bold text-green-900 font-headline">
              {analysis.complementarity.length} Complementary
            </span>
          </div>
          <p className="text-xs text-green-800 font-body line-clamp-2 leading-tight">
            {analysis.complementarity[0]}
          </p>
        </motion.div>
      )}
      </div>
    </div>
  );
}
