export function uiClasses(ui = {}) {
  const radius = {
    square: "rounded-none",
    md: "rounded-lg",
    xl: "rounded-2xl",
    pill: "rounded-full",
  };
  const shadow = { none: "shadow-none", soft: "shadow", lifted: "shadow-lg" };
  const button = {
    solid: "bg-[var(--accent)] text-[var(--secondary)]",
    outline:
      "border-2 border-[var(--accent)] text-[var(--accent)] bg-transparent",
    gradient:
      "text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]",
  };
  return {
    card: `${radius[ui.cardRadius || "xl"]} ${shadow[ui.cardShadow || "soft"]}`,
    button: button[ui.buttonStyle || "solid"],
  };
}
