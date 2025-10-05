export const presets = {
  soft: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  },
  bouncy: {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 20 },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } },
  },
  off: { hidden: {}, show: {} },
};
export const stagger = (amt = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: amt } },
});
