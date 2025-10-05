class DesignSystem {
  private static instance: DesignSystem;

  private constructor() {}

  public static getInstance(): DesignSystem {
    if (!DesignSystem.instance) {
      DesignSystem.instance = new DesignSystem();
    }
    return DesignSystem.instance;
  }

  public readonly tokens = {
    brand: {
      name: "Niew Bev",
      primary: "#22d3ee",
      primaryHover: "#06b6d4",
      bg: "#0f172a",
    },
    colors: {
      text: {
        primary: "#f8fafc",
        subtle: "#cbd5e1",
        dim: "#64748b",
      },
      bg: {
        primary: "#0f172a",
        secondary: "#1e293b",
        tertiary: "#334155",
      },
      border: "#334155",
    },
    radii: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      full: "9999px",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
    },
  };
}

export default DesignSystem.getInstance();
