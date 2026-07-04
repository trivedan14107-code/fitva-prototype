import React from "react";
import { motion as m } from "framer-motion";
import { color, space, motion } from "../design/tokens";

/**
 * FITVA Design System – Card Component
 * Replaces .card-light div. Supports staggered entrance via index prop, hover, and active highlighted glow.
 */
export default function Card({
  children,
  onClick,
  style = {},
  padding = space.lg,
  index = undefined,
  highlighted = false,
  ...rest
}) {
  const isStaggered = typeof index === "number";

  const initial = isStaggered ? { opacity: 0, y: 16 } : undefined;
  const animate = isStaggered
    ? { opacity: 1, y: 0, transition: { ...motion.spring.sheet, delay: index * motion.stagger } }
    : undefined;

  const cardStyle = {
    backgroundColor: color.surface,
    color: color.text1,
    borderRadius: "20px",
    padding: padding,
    border: highlighted ? `1px solid ${color.primary}` : `1px solid ${color.border}`,
    boxShadow: highlighted 
      ? `0 0 24px rgba(0, 229, 168, 0.18)` 
      : "0 4px 20px rgba(0, 0, 0, 0.2)",
    cursor: onClick ? "pointer" : "default",
    position: "relative",
    overflow: "hidden",
    ...style,
  };

  return (
    <m.div
      initial={initial}
      animate={animate}
      whileHover={onClick ? { scale: 1.015, backgroundColor: color.surfaceRaised } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={motion.spring.sheet}
      onClick={onClick}
      style={cardStyle}
      {...rest}
    >
      {children}
    </m.div>
  );
}
