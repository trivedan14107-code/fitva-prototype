import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * FITVA Design System – ProgressRing Component
 * Circular SVG progress indicator with spring-animated fill.
 *
 * Props:
 *   value    – current progress value (number)
 *   max      – maximum value (number, default 100)
 *   color    – stroke color (string, default "#00E5A8")
 *   size     – diameter in px (number, default 56)
 *   strokeWidth – ring thickness (number, default 5)
 *   showLabel – show percentage text in center (boolean, default true)
 *   labelColor – color of center text (string)
 *   trackColor – color of background ring (string)
 *   children – optional center content to replace default label
 */
export default function ProgressRing({
  value = 0,
  max = 100,
  color = "#00E5A8",
  size = 56,
  strokeWidth = 5,
  showLabel = true,
  labelColor,
  trackColor,
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value / max, 0), 1);

  // Spring-animated progress
  const springValue = useSpring(0, { stiffness: 120, damping: 20 });
  const offset = useTransform(springValue, (v) => circumference * (1 - v));

  useEffect(() => {
    springValue.set(pct);
  }, [pct, springValue]);

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
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor || "rgba(128,128,128,0.12)"}
          strokeWidth={strokeWidth}
        />
        {/* Animated fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {children
          ? children
          : showLabel && (
              <span
                style={{
                  fontSize: size * 0.22,
                  fontWeight: 800,
                  color: labelColor || color,
                }}
              >
                {Math.round(pct * 100)}%
              </span>
            )}
      </div>
    </div>
  );
}
