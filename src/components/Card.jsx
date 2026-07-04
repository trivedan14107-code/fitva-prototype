import { motion } from "framer-motion";

/**
 * FITVA Design System – Card Component
 * Reusable surface card with optional hover micro-animation.
 */
export default function Card({
  children,
  onClick,
  style = {},
  padding = 16,
  hoverable = false,
  ...rest
}) {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.015, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={{
        backgroundColor: "var(--fitva-surface, #FFFFFF)",
        borderRadius: 16,
        padding,
        border: "1px solid var(--fitva-border, #E5E5EA)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
