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
          bg: "rgba(0, 229, 168, 0.08)",
          border: "rgba(0, 229, 168, 0.15)",
          iconColor: colors.primary,
        };
      case "secondary":
        return {
          bg: "rgba(91, 140, 255, 0.08)",
          border: "rgba(91, 140, 255, 0.15)",
          iconColor: colors.secondary,
        };
      case "warning":
        return {
          bg: "rgba(255, 184, 77, 0.08)",
          border: "rgba(255, 184, 77, 0.15)",
          iconColor: colors.warning,
        };
      case "error":
        return {
          bg: "rgba(255, 92, 92, 0.08)",
          border: "rgba(255, 92, 92, 0.15)",
          iconColor: colors.error,
        };
      case "neutral":
      default:
        return {
          bg: "rgba(255, 255, 255, 0.04)",
          border: "rgba(255, 255, 255, 0.08)",
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
