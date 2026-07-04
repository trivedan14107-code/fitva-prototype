import React, { useEffect, useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { color, motion } from "../design/tokens";

/**
 * FITVA Design System – CelebrationBurst Component
 * Triggered on streak completion, workout completion, or challenge success.
 * Renders an energetic particle burst and glowing ring pulses.
 */
export default function CelebrationBurst({
  active = false,
  onComplete,
  tone = "primary",
}) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const activeColor = tone === "primary" ? color.primary : color.secondary;
      // Generate 24 burst particles with random trajectories
      const list = Array.from({ length: 24 }).map((_, idx) => {
        const angle = (idx / 24) * 2 * Math.PI + (Math.random() - 0.5) * 0.25;
        const distance = 80 + Math.random() * 120;
        return {
          id: idx,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 4 + Math.random() * 8,
          color: idx % 3 === 0 ? "#FFFFFF" : idx % 3 === 1 ? activeColor : color.warning,
          delay: Math.random() * 0.15,
        };
      });
      setParticles(list);

      // Auto-teardown celebration after 2 seconds
      const t = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [active, tone, onComplete]);

  return (
    <AnimatePresence>
      {active && particles.length > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Glowing central pulse ring */}
          <m.div
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...motion.spring.celebrate, duration: 1 }}
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: `4px solid ${tone === "primary" ? color.primary : color.secondary}`,
              boxShadow: `0 0 30px ${tone === "primary" ? color.primary : color.secondary}`,
            }}
          />

          <m.div
            initial={{ scale: 0.1, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...motion.spring.celebrate, duration: 1.2, delay: 0.15 }}
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: `2px solid ${color.warning}`,
              boxShadow: `0 0 20px ${color.warning}`,
            }}
          />

          {/* Burst Particles */}
          {particles.map((p) => (
            <m.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: 0.2,
                opacity: 0,
              }}
              transition={{
                ease: "easeOut",
                duration: 1.2,
                delay: p.delay,
              }}
              style={{
                position: "absolute",
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: Math.random() > 0.5 ? "50%" : "3px",
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
