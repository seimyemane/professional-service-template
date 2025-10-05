import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Services({ brand }) {
  const services = Array.isArray(brand?.services) ? brand.services : [];

  // --- UI tokens (radius/shadow) from brand.ui, with safe fallbacks ---
  const radiusMap = {
    square: "rounded-none",
    md: "rounded-lg",
    xl: "rounded-2xl",
    pill: "rounded-full",
  };
  const shadowMap = {
    none: "shadow-none",
    soft: "shadow",
    lifted: "shadow-lg",
  };
  const cardRadius = radiusMap[brand?.ui?.cardRadius || "xl"];
  const cardShadow = shadowMap[brand?.ui?.cardShadow || "soft"];

  // --- Motion presets (self-contained) ---
  const preset = brand?.motion?.preset || "soft";
  const duration = brand?.motion?.duration ?? 0.55;
  const staggerAmt = brand?.motion?.stagger ?? 0.08;
  const p =
    preset === "bouncy"
      ? {
          hidden: { opacity: 0, y: 14 },
          show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 220, damping: 20 },
          },
        }
      : preset === "fade"
      ? {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration } },
        }
      : preset === "off"
      ? { hidden: {}, show: {} }
      : {
          hidden: { opacity: 0, y: 12 },
          show: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
        };
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: staggerAmt } },
  };

  // --- Icon resolver: try to match by keywords; fallback to rotate through provided icons ---
  const icons = brand?.theme?.serviceIcons || {};
  const iconList = Object.values(icons);
  const pickIcon = (label, idx) => {
    if (!icons || !Object.keys(icons).length) return null;
    const s = String(label || "").toLowerCase();
    const key =
      (s.includes("hair") && (icons.hair || icons.color)) ||
      (s.includes("nail") && icons.nails) ||
      (s.includes("spa") && icons.spa) ||
      (s.includes("tax") && icons.tax) ||
      (s.includes("book") && icons.bookkeeping) ||
      (s.includes("advis") && icons.advisory) ||
      (s.includes("phone") && icons.phone) ||
      (s.includes("tablet") && icons.tablet) ||
      (s.includes("laptop") && icons.laptop);
    if (key) return key;
    return iconList[idx % iconList.length];
  };

  if (services.length === 0) return null;

  return (
    <motion.section
      id="services"
      className="py-16 bg-gray-50"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          variants={p}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: "var(--secondary)" }}
        >
          Our Services
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service, index) => {
            const icon = pickIcon(service, index);
            return (
              <motion.div
                key={index}
                variants={p}
                className={`group p-6 bg-white ${cardRadius} ${cardShadow} hover:shadow-xl transition duration-300 flex flex-col items-center text-center`}
              >
                {icon && (
                  <img
                    src={icon}
                    alt=""
                    className="w-12 h-12 mb-4 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                )}
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--secondary)" }}
                >
                  {service}
                </h3>
                <p className="mt-2 text-gray-600">
                  Professional {String(service).toLowerCase()} tailored to your
                  needs.
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
// Note: service descriptions are placeholders; ideally would be part of brand data
