import React from "react";
import { motion as m } from "framer-motion";
import { color, typography, motion } from "../design/tokens";

/**
 * FITVA Design System – Button Component
 * Variants: primary | secondary | ghost | danger
 * Uses spring-based snappy press animation, support for loading and disabled states.
 */
export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
  style = {},
  fullWidth = false,
  ...rest
}) {
  const getStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: color.primary,
          color: color.bg,
          border: "none",
          boxShadow: `0 4px 16px rgba(0, 229, 168, 0.25)`,
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          color: color.primary,
          border: `1.5px solid ${color.primary}`,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: color.text2,
          border: "none",
        };
      case "danger":
        return {
          backgroundColor: color.error,
          color: color.text1,
          border: "none",
          boxShadow: `0 4px 16px rgba(255, 92, 92, 0.2)`,
        };
      default:
        return {};
    }
  };

  const baseStyle = {
    fontFamily: typography.body,
    fontWeight: "700",
    fontSize: "14px",
    padding: "12px 24px",
    borderRadius: "14px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    outline: "none",
    width: fullWidth ? "100%" : "auto",
    userSelect: "none",
    transition: "background-color 0.2s, border-color 0.2s, color 0.2s",
    ...getStyles(),
    ...style,
  };

  return (
    <m.button
      whileTap={!(disabled || loading) ? { scale: 0.96 } : {}}
      transition={motion.spring.snappy}
      onClick={disabled || loading ? undefined : onClick}
      style={{
        ...baseStyle,
        opacity: disabled ? 0.4 : 1,
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <m.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: "16px",
            height: "16px",
            border: `2px solid currentColor`,
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        />
      ) : null}
      {children}
    </m.button>
  );
}
