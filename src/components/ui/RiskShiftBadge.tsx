"use client";

import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/types/enums";
import { TrendingDown, TrendingUp, Minus, AlertCircle } from "lucide-react";

interface RiskShiftBadgeProps {
  fromLevel: RiskLevel;
  toLevel: RiskLevel;
  rationale: string;
}

const LEVEL_CONFIG = {
  [RiskLevel.HIGH]: { label: 'H', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
  [RiskLevel.MEDIUM]: { label: 'M', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  [RiskLevel.LOW]: { label: 'L', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
};

const DIRECTION_CONFIG = {
  downgrade: {
    icon: TrendingDown,
    label: 'Reduced',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  upgrade: {
    icon: TrendingUp,
    label: 'Increased',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  neutral: {
    icon: Minus,
    label: 'Unchanged',
    color: 'text-stone-600',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-200',
  },
};

export default function RiskShiftBadge({ fromLevel, toLevel, rationale }: RiskShiftBadgeProps) {
  const fromConfig = LEVEL_CONFIG[fromLevel];
  const toConfig = LEVEL_CONFIG[toLevel];

  // Determine direction
  const levelOrder = { [RiskLevel.LOW]: 1, [RiskLevel.MEDIUM]: 2, [RiskLevel.HIGH]: 3 };
  const fromOrder = levelOrder[fromLevel];
  const toOrder = levelOrder[toLevel];

  const direction =
    toOrder < fromOrder ? 'downgrade' : toOrder > fromOrder ? 'upgrade' : 'neutral';
  const directionConfig = DIRECTION_CONFIG[direction];
  const DirectionIcon = directionConfig.icon;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${directionConfig.bgColor} ${directionConfig.borderColor}`}>
      {/* From Level */}
      <Badge
        variant="outline"
        className={`text-xs font-bold ${fromConfig.textColor} ${fromConfig.bgColor} border-${fromConfig.color.split('-')[1]}-300`}
      >
        {fromConfig.label}
      </Badge>

      {/* Direction Indicator */}
      <div className={`flex items-center gap-1 px-2 py-1 rounded ${directionConfig.bgColor}`}>
        <DirectionIcon className={`w-3 h-3 ${directionConfig.color}`} />
        <span className={`text-xs font-medium ${directionConfig.color}`}>
          {directionConfig.label}
        </span>
      </div>

      {/* To Level */}
      <Badge
        variant="outline"
        className={`text-xs font-bold ${toConfig.textColor} ${toConfig.bgColor} border-${toConfig.color.split('-')[1]}-300`}
      >
        {toConfig.label}
      </Badge>

      {/* Rationale */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#1A1A1A]/70 font-body leading-snug truncate" title={rationale}>
          {rationale}
        </p>
      </div>

      {/* Alert if upgrade */}
      {direction === 'upgrade' && (
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      )}
    </div>
  );
}
