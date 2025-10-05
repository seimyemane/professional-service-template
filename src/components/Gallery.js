import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Gallery({ brand, headline = "Gallery" }) {
  const images = Array.isArray(brand?.gallery) ? brand.gallery : [];
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

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
  const cardShadow = shadowMap[brand?.ui?.cardShadow || "soft"]; // <-- fixed

  // Motion
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

  // Lightbox state & handlers
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length]
  );
  const prevActive = useRef(null);
  const openAt = useCallback((i) => {
    prevActive.current = document.activeElement;
    setIdx(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    prevActive.current?.focus?.();
  }, []);

  const closeRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") {
        const focusables = [
          closeRef.current,
          prevBtnRef.current,
          nextBtnRef.current,
        ].filter(Boolean);
        if (!focusables.length) return;
        const i = focusables.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (i <= 0) {
            e.preventDefault();
            focusables[focusables.length - 1]?.focus();
          }
        } else {
          if (i === focusables.length - 1) {
            e.preventDefault();
            focusables[0]?.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  useEffect(() => {
    if (!open) return;
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = o;
    };
  }, [open]);

  useEffect(() => {
    if (!open || images.length < 2) return;
    [
      (idx + 1) % images.length,
      (idx - 1 + images.length) % images.length,
    ].forEach((i) => {
      const img = new Image();
      img.src = images[i];
    });
  }, [open, idx, images]);

  if (!images.length) return null;

  return (
    <motion.section
      id="gallery"
      className="py-16 bg-gray-50"
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

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {images.map((src, i) => (
            <motion.button
              key={i}
              type="button"
              variants={item}
              onClick={() => openAt(i)}
              className={`relative group overflow-hidden ${cardRadius} ${cardShadow} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              style={{ ["--tw-ring-color"]: "var(--accent)" }}
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              <img
                src={src}
                alt={`Gallery item ${i + 1}`}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <span className="text-white font-semibold">View</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[idx]}
              alt={`Enlarged gallery item ${idx + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
              loading="eager"
              decoding="async"
            />
            <button
              ref={closeRef}
              onClick={close}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-10 h-10 shadow grid place-items-center"
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            {images.length > 1 && (
              <>
                <button
                  ref={prevBtnRef}
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-r-lg px-3 py-2 shadow"
                  aria-label="Previous image"
                  title="Previous"
                >
                  ‹
                </button>
                <button
                  ref={nextBtnRef}
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-l-lg px-3 py-2 shadow"
                  aria-label="Next image"
                  title="Next"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
}
