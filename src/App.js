import React, { useState, useEffect } from "react";
import ThemeProvider from "./components/ThemeProvider";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Services from "./components/Services";
import Contact from "./components/Contact";
import About from "./components/About";
import Gallery from "./components/Gallery";
import FAQ from "./components/FAQ";
import Testimonials from "./components/Testimonials";
import Price from "./components/Price";
import Map from "./components/Map";
import Booking from "./components/Booking";

function App() {
  const [brandData, setBrandData] = useState(null);
  const [error, setError] = useState(null);
  const brand = process.env.REACT_APP_BRAND;

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setBrandData(null);

    (async () => {
      try {
        const mod = await import(`./brands/${brand}.json`);
        const data = mod?.default ?? mod;
        if (!cancelled) setBrandData(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load brand");
        console.error("Error loading brand config:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brand]);

  // Set the page title when brand loads
  useEffect(() => {
    if (brandData?.brandName) document.title = brandData.brandName;
  }, [brandData]);

  // Smooth scroll helper with header offset
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header");
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (error)
    return <div className="p-4 text-red-600">Brand load failed: {error}</div>;
  if (!brandData)
    return (
      <div className="p-4 animate-pulse text-gray-500">Loading brand…</div>
    );

  return (
    <ThemeProvider brand={brandData}>
      <div className="App">
        <Header
          brand={brandData}
          nav={[
            { label: "Services", href: "#services" },
            { label: "Pricing", href: "#pricing" },
            { label: "Contact", href: "#contact" },
            { label: "Book", href: "#book" },
          ]}
          ctaHref="#book"
          onCtaClick={() => scrollToId("book")}
        />
        <Hero
          brand={brandData}
          ctaHref="#book"
          onSecondaryClick={() => scrollToId("services")}
          secondaryText="View Services"
        />
        <Services brand={brandData} />
        <Gallery brand={brandData} />
        <Price brand={brandData} />
        <About brand={brandData} />
        <Testimonials brand={brandData} />
        <Booking brand={brandData} id="#booking" />{" "}
        {/* ensure <section id="book"> inside */}
        <Map brand={brandData} />
        <FAQ brand={brandData} />
        <Contact brand={brandData} />
        <Footer brand={brandData} />
      </div>
    </ThemeProvider>
  );
}

export default App;
