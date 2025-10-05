import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function Hero({
  brand,
  ctaHref = "#book",
  onSecondaryClick,
  secondaryText = "View Services",
}) {
  // Init Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  // ---- FULL SCREEN HEIGHT (accounts for fixed header) ----
  const [heroH, setHeroH] = useState("100dvh");
  useLayoutEffect(() => {
    const header = document.querySelector("header");
    const update = () => {
      const h = header ? header.getBoundingClientRect().height : 0;
      setHeroH(`calc(100dvh - ${h}px)`);
    };
    update();
    window.addEventListener("resize", update);
    let ro;
    if (header && "ResizeObserver" in window) {
      ro = new ResizeObserver(update);
      ro.observe(header);
    }
    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, []);

  // Motion presets
  const preset = brand?.motion?.preset || "soft";
  const duration = brand?.motion?.duration ?? 0.55;
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

  // Smooth-scroll helper (offset for fixed header)
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

  const heroVariant = brand?.ui?.heroVariant || "center";
  const bgStyle = brand?.hero?.heroImage
    ? {
        backgroundImage: `url(${brand.hero.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundImage: `linear-gradient(135deg, var(--primary), var(--accent))`,
      };

  const calLink = brand?.pages?.booking?.linkUrl;
  const useCal = Boolean(calLink);

  // Apply exact height so it fills the viewport under the fixed header
  const sectionStyle = { ...bgStyle, height: heroH };

  return (
    <motion.section
      id="home"
      className={`relative w-full ${
        heroVariant === "center" ? "grid place-items-center text-center" : ""
      }`}
      style={sectionStyle}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/40" />

      {heroVariant === "split" ? (
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full h-full">
          <div className="grid md:grid-cols-2 gap-10 items-center h-full">
            <motion.div variants={p} className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {brand?.hero?.title}
              </h1>
              <p className="text-lg md:text-xl mb-6 drop-shadow-md opacity-95">
                {brand?.hero?.subtitle}
              </p>

              <div className="flex flex-wrap gap-3">
                {useCal ? (
                  <button
                    className="px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--secondary)",
                    }}
                    data-cal-namespace="30min"
                    data-cal-link={calLink}
                    data-cal-config='{"layout":"month_view"}'
                  >
                    {brand?.hero?.cta || "Book Now"}
                  </button>
                ) : (
                  <a
                    href={ctaHref}
                    onClick={(e) => handleAnchor(e, ctaHref)}
                    className="px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition bg-[var(--accent)] text-[var(--secondary)]"
                  >
                    {brand?.hero?.cta || "Get Started"}
                  </a>
                )}

                {secondaryText && (
                  <button
                    type="button"
                    onClick={onSecondaryClick}
                    className="px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition border-2 border-white/80 text-white"
                  >
                    {secondaryText}
                  </button>
                )}
              </div>
            </motion.div>

            {brand?.hero?.heroImage && (
              <motion.div variants={p} className="relative">
                <img
                  src={brand.hero.heroImage}
                  alt=""
                  className="rounded-2xl shadow-2xl w-full h-[380px] lg:h-[420px] md:h-[520px] object-cover"
                />
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        // Centered variant content — now perfectly centered
        <motion.div
          variants={p}
          className="relative z-10 max-w-3xl text-white px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {brand?.hero?.title}
          </h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md">
            {brand?.hero?.subtitle}
          </p>

          <div className="flex items-center justify-center gap-3">
            {useCal ? (
              <button
                className="px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--secondary)",
                }}
                data-cal-namespace="30min"
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view"}'
              >
                {brand?.hero?.cta || "Book Now"}
              </button>
            ) : (
              <a
                href={ctaHref}
                onClick={(e) => handleAnchor(e, ctaHref)}
                className="px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition bg-[var(--accent)] text-[var(--secondary)]"
              >
                {brand?.hero?.cta || "Get Started"}
              </a>
            )}

            {secondaryText && (
              <button
                type="button"
                onClick={onSecondaryClick}
                className="px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition border-2 border-white/80 text-white"
              >
                {secondaryText}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {useCal && (
        <Cal namespace="30min" calLink={calLink} style={{ display: "none" }} />
      )}
    </motion.section>
  );
}
// Note: ctaHref is a fallback if no Cal link provided in brand data
