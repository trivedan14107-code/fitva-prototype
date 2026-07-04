import React, { useEffect } from "react";
import { motion as m, useSpring, useTransform } from "framer-motion";
import { color as colors, typography } from "../design/tokens";

/**
 * FITVA Design System – Momentum Ring Component
 * Replaces every linear progress bar with a circular progress ring.
 * Features a glowing comet-head that travels along the leading edge of the fill.
 */
export default function ProgressRing({
  value = 0, // 0 to 100
  size = 64,
  strokeWidth = 7,
  color = colors.primary,
  label = "",
  showLabel = true,
}) {
  const pct = Math.min(Math.max(value / 100, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Spring-animated progress value
  const progressSpring = useSpring(0, {
    stiffness: 90,
    damping: 18,
    mass: 1
  });

  useEffect(() => {
    progressSpring.set(pct);
  }, [pct, progressSpring]);

  // Derived transforms
  const strokeDashoffset = useTransform(progressSpring, (v) => circumference * (1 - v));
  const rotationAngle = useTransform(progressSpring, (v) => v * 360);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", overflow: "visible" }}
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={strokeWidth}
        />

        {/* Animated fill path */}
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />

        {/* Comet-head Group: Rotates to the leading edge of the stroke */}
        {pct > 0 && (
          <m.g
            style={{
              transformOrigin: `${size / 2}px ${size / 2}px`,
              rotate: rotationAngle,
            }}
          >
            {/* Soft outer glow */}
            <circle
              cx={size / 2}
              cy={size / 2 - radius}
              r={strokeWidth * 0.9}
              fill={color}
              opacity={0.4}
              style={{
                filter: `blur(${strokeWidth * 0.5}px)`,
              }}
            />
            {/* Sharp inner core */}
            <circle
              cx={size / 2}
              cy={size / 2 - radius}
              r={strokeWidth * 0.55}
              fill="#FFFFFF"
              style={{
                boxShadow: `0 0 10px ${color}`,
              }}
            />
          </m.g>
        )}
      </svg>

      {/* Optional Central Label */}
      {showLabel && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: typography.stats,
            fontSize: `${size * 0.22}px`,
            fontWeight: "700",
            color: colors.text1,
            pointerEvents: "none",
          }}
        >
          {label || `${Math.round(pct * 100)}%`}
        </div>
      )}
    </div>
  );
}
