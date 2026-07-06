import React from "react";
import { color as colors } from "../design/tokens";

/**
 * FITVA Design System – IconBadge Component
 * Replaces the 46+ inline handwritten icon-in-circle variations.
 * Tones: primary | secondary | warning | error | neutral
 */
export default function IconBadge({
  icon,
  tone = "neutral",
  size = 32,
  style = {},
}) {
  const getToneColors = () => {
    switch (tone) {
      case "primary":
        return {
          bg: "var(--badge-primary-bg)",
          border: "var(--badge-primary-border)",
          iconColor: colors.primary,
        };
      case "secondary":
        return {
          bg: "var(--badge-secondary-bg)",
          border: "var(--badge-secondary-border)",
          iconColor: colors.secondary,
        };
      case "warning":
        return {
          bg: "var(--badge-warning-bg)",
          border: "var(--badge-warning-border)",
          iconColor: colors.warning,
        };
      case "error":
        return {
          bg: "var(--badge-error-bg)",
          border: "var(--badge-error-border)",
          iconColor: colors.error,
        };
      case "neutral":
      default:
        return {
          bg: "var(--badge-neutral-bg)",
          border: "var(--badge-neutral-border)",
          iconColor: colors.text2,
        };
    }
  };

  const { bg, border, iconColor } = getToneColors();

  // Clone icon to automatically inject the correct size and color
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon, {
        size: icon.props.size || Math.round(size * 0.5),
        color: icon.props.color || iconColor,
      })
    : icon;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {renderedIcon}
    </div>
  );
}
