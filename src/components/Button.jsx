import { motion } from "framer-motion";

/**
 * FITVA Design System – Button Component
 * Variants: primary | secondary | ghost | danger
 * Uses spring-based press animation (not just scale).
 */

const COLORS = {
  primary: "#00E5A8",
  secondary: "#5B8CFF",
  success: "#00A86B",
  warning: "#FFB84D",
  error: "#FF2D55",
};

const variantStyles = {
  primary: {
    backgroundColor: COLORS.primary,
    color: "#FFFFFF",
    border: "none",
    boxShadow: "0 6px 20px rgba(0, 229, 168, 0.35)",
  },
  secondary: {
    backgroundColor: "transparent",
    color: COLORS.primary,
    border: `1.5px solid ${COLORS.primary}`,
    boxShadow: "none",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "inherit",
    border: "none",
    boxShadow: "none",
  },
  danger: {
    backgroundColor: COLORS.error,
    color: "#FFFFFF",
    border: "none",
    boxShadow: "0 6px 20px rgba(255, 45, 85, 0.3)",
  },
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  style = {},
  fullWidth = false,
  ...rest
}) {
  const base = variantStyles[variant] || variantStyles.primary;

  return (
    <motion.button
      whileTap={{
        scale: 0.94,
        y: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={disabled ? undefined : onClick}
      style={{
        ...base,
        padding: "12px 20px",
        borderRadius: 12,
        fontWeight: 800,
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "inherit",
        letterSpacing: "0.3px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
