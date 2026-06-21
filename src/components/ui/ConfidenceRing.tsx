"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfidenceRingProps {
  confidence: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  animate?: boolean;
}

export default function ConfidenceRing({
  confidence,
  size = 120,
  strokeWidth = 8,
  label = "Confidence",
  showPercentage = true,
  animate = true,
}: ConfidenceRingProps) {
  const [displayedConfidence, setDisplayedConfidence] = useState(0);

  useEffect(() => {
    if (animate) {
      const duration = 1000; // 1 second animation
      const steps = 60;
      const increment = confidence / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= confidence) {
          setDisplayedConfidence(confidence);
          clearInterval(timer);
        } else {
          setDisplayedConfidence(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayedConfidence(confidence);
    }
  }, [confidence, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedConfidence / 100) * circumference;

  // Color based on confidence level
  const getColor = () => {
    if (displayedConfidence >= 70) return "#10B981"; // Green
    if (displayedConfidence >= 40) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="drop-shadow-lg"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <>
              <span className="text-3xl font-bold text-gray-900 font-headline">
                {Math.round(displayedConfidence)}%
              </span>
              <span className="text-xs text-gray-500 font-body">{label}</span>
            </>
          )}
        </div>
      </div>

      {/* Confidence Level Badge */}
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-gray-700 font-body">
          {displayedConfidence >= 70
            ? "High Confidence"
            : displayedConfidence >= 40
            ? "Medium Confidence"
            : "Low Confidence"}
        </span>
      </div>
    </div>
  );
}
