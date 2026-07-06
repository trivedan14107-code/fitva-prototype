export const color = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
  bg: "var(--color-bg)",
  surface: "var(--color-surface)",
  surfaceRaised: "var(--color-surface-raised)",
  text1: "var(--color-text1)",
  text2: "var(--color-text2)",
  text3: "var(--color-text3)",
  border: "var(--color-border)",
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
