import { motion } from "framer-motion";

export default function Pricing({ brand, headline = "Pricing" }) {
  const pricing = brand?.pages?.pricing;
  const enabled = pricing?.enabled !== false;
  const plans = Array.isArray(pricing?.plans) ? pricing.plans : [];
  if (!enabled || plans.length === 0) return null;

  // UI tokens
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

  // Motion presets
  const preset = brand?.motion?.preset || "soft";
  const duration = brand?.motion?.duration ?? 0.55;
  const staggerAmt = brand?.motion?.stagger ?? 0.08;
  const item =
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

  // Smooth scroll with header offset
  const handleAnchor = (e, href) => {
    if (!href?.startsWith("#")) return;

    e.preventDefault();
    const id = href.slice(1);

    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector("header");

    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 8;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.section
      id="pricing"
      className="py-16 bg-white"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: "var(--secondary)" }}
        >
          {headline}
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.article
              key={i}
              variants={item}
              className={`relative bg-white p-6 flex flex-col border border-gray-200 ${cardRadius} ${cardShadow} ${
                plan.recommended ? "ring-2" : ""
              }`}
              style={
                plan.recommended
                  ? { "--tw-ring-color": "var(--accent)" }
                  : undefined
              }
              aria-label={`${plan.name || "Plan"} pricing card`}
            >
              {plan.recommended && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Most Popular
                </span>
              )}

              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--secondary)" }}
              >
                {plan.name || "Plan"}
              </h3>

              <div className="mb-4">
                {renderPrice(plan.price)}
                {plan.subtext && (
                  <div className="text-sm text-gray-500">{plan.subtext}</div>
                )}
              </div>

              {Array.isArray(plan.features) && plan.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <Check color={"var(--accent)"} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {plan.note && (
                <p className="text-sm text-gray-500 mb-6">{plan.note}</p>
              )}

              <div className="mt-auto">
                <a
                  href="#booking"
                  onClick={(e) => handleAnchor(e, "#booking")}
                  className="block w-full text-center font-semibold px-5 py-3 rounded-xl shadow hover:shadow-md transition"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--secondary)",
                  }}
                >
                  {brand?.hero?.cta || "Get Started"}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function renderPrice(price) {
  if (price === undefined || price === null || price === "") {
    return <div className="text-gray-500">Contact for quote</div>;
  }
  const raw = String(price).trim();
  const hasDollar = raw.startsWith("$");
  const numeric = hasDollar ? raw.slice(1) : raw;

  return (
    <div className="flex items-baseline gap-1">
      <span
        className="text-4xl md:text-5xl font-extrabold"
        style={{ color: "var(--primary)" }}
      >
        {hasDollar ? raw : `$${numeric}`}
      </span>
      <span className="text-gray-500">/ service</span>
    </div>
  );
}

function Check({ color = "var(--accent)" }) {
  return (
    <svg
      className="w-5 h-5 mt-0.5 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M16.7 5.8l-7.6 7.6-3.8-3.8" />
    </svg>
  );
}
