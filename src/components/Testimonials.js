import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Testimonials({ brand, headline = "What Clients Say" }) {
  // Move all hooks to the top, before any early return
  const items = useMemo(
    () => brand?.pages?.testimonials?.items ?? brand?.testimonials ?? [],
    [brand]
  );
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  // clamp index
  useEffect(() => {
    if (index < 0) setIndex(0);
    if (index > items.length - 1) setIndex(items.length - 1);
  }, [index, items.length]);

  // sync index on scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = () => {
      const w = el.clientWidth || 1;
      const i = Math.round(el.scrollLeft / w);
      setIndex(i);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  if (!Array.isArray(items) || items.length === 0) return null;

  // UI tokens (radius/shadow)
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
  const itemV =
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
  const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: staggerAmt } },
  };

  const scrollTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, items.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  };
  const next = () => scrollTo(index + 1);
  const prev = () => scrollTo(index - 1);

  const hasBg = Boolean(brand?.theme?.backgroundImage);

  return (
    <motion.section
      id="testimonials"
      className="py-16"
      style={{
        background: hasBg
          ? `linear-gradient(to bottom, rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${brand.theme.backgroundImage}) center/cover no-repeat`
          : `linear-gradient(135deg, color-mix(in srgb, var(--primary) 13%, transparent), color-mix(in srgb, var(--primary) 7%, transparent))`,
      }}
      aria-label="Testimonials"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerV}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          variants={itemV}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
          style={{ color: hasBg ? "#fff" : "var(--secondary)" }}
        >
          {headline}
        </motion.h2>

        {/* Carousel */}
        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          aria-live="polite"
        >
          {/* Buttons */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow items-center justify-center hover:shadow-lg"
            disabled={index === 0}
            style={{ opacity: index === 0 ? 0.5 : 1 }}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow items-center justify-center hover:shadow-lg"
            disabled={index === items.length - 1}
            style={{ opacity: index === items.length - 1 ? 0.5 : 1 }}
          >
            ›
          </button>

          <div
            ref={trackRef}
            className="snap-x snap-mandatory overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div className="flex">
              {items.map((t, i) => (
                <motion.article
                  key={i}
                  variants={itemV}
                  className="snap-center shrink-0 w-full px-1"
                  aria-label={`Testimonial ${i + 1} of ${items.length}`}
                >
                  <Card
                    t={t}
                    cardRadius={cardRadius}
                    cardShadow={cardShadow}
                    hasBg={hasBg}
                  />
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: i === index ? "var(--primary)" : "#d1d5db",
                opacity: i === index ? 1 : 0.7,
              }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Card({ t, cardRadius, cardShadow, hasBg }) {
  const rating =
    typeof t?.rating === "number" ? Math.max(0, Math.min(5, t.rating)) : null;

  return (
    <div
      className={`mx-auto max-w-3xl ${cardRadius} ${cardShadow} p-6 md:p-8 bg-white/95 backdrop-blur ${
        hasBg ? "border border-white/20" : ""
      }`}
    >
      {/* Rating */}
      {rating !== null && (
        <div className="mb-4 flex" aria-label={`Rating: ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star key={idx} filled={idx < rating} />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-lg md:text-xl text-gray-800 leading-relaxed">
        “{t?.quote || "Excellent service and a great experience!"}”
      </blockquote>

      {/* Person */}
      <div className="mt-6 flex items-center gap-4">
        {t?.photo ? (
          <img
            src={t.photo}
            alt={t?.name ? `${t.name} photo` : "Client photo"}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full grid place-items-center text-white"
            style={{ backgroundColor: "var(--primary)" }}
            aria-hidden="true"
          >
            <span className="font-semibold">
              {(t?.name || "C").slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">
            {t?.name || "Happy Client"}
          </div>
          {t?.role && <div className="text-sm text-gray-500">{t.role}</div>}
        </div>
      </div>
    </div>
  );
}

function Star({ filled }) {
  const color = "var(--primary)";
  return (
    <svg
      className="w-5 h-5 mr-1"
      viewBox="0 0 20 20"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M10 2.5l2.47 5 5.53.8-4 3.9.95 5.5L10 15.9 5.05 17.7 6 12.2l-4-3.9 5.53-.8L10 2.5z" />
    </svg>
  );
}
