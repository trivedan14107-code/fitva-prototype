export const color = {
  primary: "#E5989B",       // Soft, muted pastel coral/pink tone
  secondary: "#8EA4C0",     // Soft muted blue/gray
  warning: "#FFD1B3",       // Missed goals, reminders
  error: "#FF9A9A",         // Critical alerts, errors
  bg: "#F0F4F8",            // Background & Base Surfaces: highly uniform light pastel blue/gray tint
  surface: "#F0F4F8",       // Cards, sheets, nav bar base
  surfaceRaised: "#E5ECF4", // Recessed/pressed/hover state base
  text1: "#2C3E50",         // Typography: Dark slate gray/navy blue text
  text2: "#5A738E",         // Secondary text: medium slate blue/gray
  text3: "#8CA0BA",         // Muted/tertiary text
  border: "rgba(163, 177, 198, 0.35)",
};

export const typography = {
  body: "'Poppins', sans-serif",
  stats: "'Space Grotesk', sans-serif",
};

export const space = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
};

export const motion = {
  spring: {
    snappy: {
      type: "spring",
      stiffness: 500,
      damping: 32,
    },
    sheet: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
    celebrate: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  duration: {
    ringFill: 0.9, // seconds
  },
  stagger: 0.05, // seconds
};
