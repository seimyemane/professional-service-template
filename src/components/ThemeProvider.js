import React from "react";

export default function ThemeProvider({ brand, children }) {
  const theme = brand?.theme || {};
  const font = brand?.font || {};
  const style = {
    "--primary": theme.primary || "#0D6EFD",
    "--secondary": theme.secondary || "#111827",
    "--accent": theme.accent || "#22C55E",
    "--font-heading": font.heading || "Inter",
    "--font-body": font.body || "Inter",
  };
  return (
    <div
      style={style}
      className="min-h-screen"
      data-decor={brand?.ui?.decor || "none"}
    >
      {children}
    </div>
  );
}
