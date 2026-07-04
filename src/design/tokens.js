export const color = {
  primary: "#00E5A8",       // Momentum Green — progress, growth, primary actions, the Ring
  secondary: "#5B8CFF",     // Rex Blue — AI/coach moments only
  warning: "#FFB84D",       // missed goals, reminders
  error: "#FF5C5C",         // failed actions, critical alerts
  bg: "#0B1020",            // app background
  surface: "#151C32",       // cards, sheets, nav bar
  surfaceRaised: "#1B2340", // pressed/hover state
  text1: "#F5F7FA",         // primary text
  text2: "#8B93A7",         // secondary text
  text3: "#565D72",         // disabled/tertiary text
  border: "rgba(255, 255, 255, 0.08)",
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
