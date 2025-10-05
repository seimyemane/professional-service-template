import { useState, useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function Header({ brand }) {
  const [open, setOpen] = useState(false);

  // Build nav from brand.navigation (fallback to anchors)
  const nav = (brand?.navigation || [])
    .filter((n) => n?.enabled)
    .map((n) => ({
      ...n,
      // Convert "/services" -> "#services" for one-page scroll
      href: n.path?.startsWith("/#")
        ? n.path.slice(1)
        : n.path?.startsWith("/")
        ? `#${n.path.slice(1)}`
        : n.path || "#",
    }));

  // Cal.com config
  const calNamespace = "30min";
  const calLink = brand?.pages?.booking?.linkUrl || "thedevicelab-vckcck/30min";

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: calNamespace });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  // Smooth scroll with header offset
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header");
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNavClick = (e, href) => {
    if (href?.startsWith("#")) {
      e.preventDefault();
      scrollToId(href.slice(1));
      setOpen(false);
    }
  };

  return (
    <header
      className=" top-0 left-0 w-full z-50 shadow "
      style={{ backgroundColor: "var(--secondary)" }}
    >
      {/* Hidden Cal mount (registers the event type) */}
      <Cal
        namespace={calNamespace}
        calLink={calLink}
        style={{ display: "none" }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Brand Name */}
        <a
          href="/"
          className="text-2xl font-bold tracking-wide"
          style={{ color: "var(--primary)" }}
        >
          {brand?.logoText || brand?.brandName}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav
            .filter((n) => !n.cta)
            .map((item) => (
              <a
                key={item.path}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-white"
                style={{ color: "var(--accent)" }}
              >
                {item.label}
              </a>
            ))}

          {/* CTA opens Cal (button; no invalid href attrs) */}
          <button
            className="px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md transition"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--secondary)",
            }}
            data-cal-namespace={calNamespace}
            data-cal-link={calLink}
            data-cal-config='{"layout":"month_view"}'
          >
            {brand?.hero?.cta || "Book Now"}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className=" md:hidden bg-gray-900 text-white px-6 py-4 flex flex-col gap-4 items-center h-[100vh]">
          {nav
            .filter((n) => !n.cta)
            .map((item) => (
              <a
                key={item.path}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block"
              >
                {item.label}
              </a>
            ))}

          <button
            className="px-4 py-2 rounded-lg font-semibold shadow"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--secondary)",
            }}
            data-cal-namespace={calNamespace}
            data-cal-link={calLink}
            data-cal-config='{"layout":"month_view"}'
            onClick={() => setOpen(false)}
          >
            {brand?.hero?.cta || "Book Now"}
          </button>
        </div>
      )}
    </header>
  );
}
