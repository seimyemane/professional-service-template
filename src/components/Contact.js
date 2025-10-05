import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function Contact({ brand }) {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ sending: false, ok: null, err: "" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Optional: warn if env vars are missing
  useEffect(() => {
    if (
      !process.env.REACT_APP_EMAILJS_SERVICE_ID ||
      !process.env.REACT_APP_EMAILJS_TEMPLATE_ID ||
      !process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    ) {
      console.warn("EmailJS env vars are missing. Check your .env");
    }
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, ok: null, err: "" });

    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current, // MUST be the FORM element
        { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY }
      );

      setStatus({ sending: false, ok: true, err: "" });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus({
        sending: false,
        ok: false,
        err: "Failed to submit. Please try again.",
      });
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">{brand?.contact?.phone}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">{brand?.contact?.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <p className="text-gray-600">{brand?.contact?.address}</p>
            </div>
            {brand?.contact?.mapLink && (
              <a
                href={brand.contact.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-5 py-3 rounded-lg font-semibold shadow transition"
                style={{
                  backgroundColor: brand?.theme?.accent || "#10B981",
                  color: brand?.theme?.secondary || "#0B1020",
                }}
              >
                View on Map
              </a>
            )}
          </div>

          {/* Contact Form */}
          <form
            id="contactForm"
            ref={formRef}
            onSubmit={onSubmit}
            className="space-y-6 bg-gray-50 p-6 rounded-2xl shadow"
          >
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                name="name" // must match EmailJS template var
                type="text"
                value={form.name}
                onChange={onChange}
                required
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                name="email" // must match EmailJS template var
                type="email"
                value={form.email}
                onChange={onChange}
                required
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                name="message" // must match EmailJS template var
                rows="4"
                value={form.message}
                onChange={onChange}
                required
                className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={status.sending}
              className="w-full py-3 rounded-lg font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: brand?.theme?.primary || "#0288D1",
                color: "#fff",
              }}
            >
              {status.sending ? "Sending..." : "Send Message"}
            </button>

            {/* Status messages */}
            <p
              className={`text-sm ${
                status.ok === true
                  ? "text-green-600"
                  : status.ok === false
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
              aria-live="polite"
            >
              {status.ok === true &&
                "Message sent! We’ll get back to you shortly."}
              {status.ok === false && status.err}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
