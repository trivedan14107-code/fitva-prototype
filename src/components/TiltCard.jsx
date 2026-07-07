import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * FITVA Design System – TiltCard Component
 * A 3D spring-based tilt card powered by Framer Motion.
 * Tracks pointer position on hover and applies smooth rotateX/rotateY + shine.
 *
 * Props:
 *   children  – card inner content
 *   style     – custom container styles
 *   padding   – inner padding (default: 14px)
 *   onClick   – click handler
 */
export default function TiltCard({
  children,
  style = {},
  padding = "14px",
  onClick,
  tiltStrength = 12,   // max rotation degrees
  scaleOnHover = 1.03, // subtle lift
}) {
  const ref = useRef(null);

  // Raw pointer position (-0.5 to 0.5 relative to card center)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring physics for smooth, natural feel
  const springConfig = { stiffness: 180, damping: 22, mass: 0.8 };
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-tiltStrength, tiltStrength]), springConfig);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [tiltStrength, -tiltStrength]), springConfig);

  // Radial shine follows the pointer
  const shineX = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]), springConfig);
  const shineY = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]), springConfig);

  function onMouseMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={ref}
      style={{ perspective: "900px", ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          backgroundColor: "var(--color-surface)",
          borderRadius: "24px",
          padding,
          border: "1.5px solid var(--color-border)",
          boxShadow: "var(--shadow-extruded)",
          position: "relative",
          overflow: "hidden",
          cursor: onClick ? "pointer" : "default",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          boxSizing: "border-box",
        }}
        whileHover={{ scale: scaleOnHover }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {/* Radial Shine Overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: 10,
            background: useTransform(
              [shineX, shineY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)`
            ),
          }}
        />

        {/* Card Content */}
        {children}
      </motion.div>
    </div>
  );
}
