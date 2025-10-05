import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
export default function Booking({ brand, headline = "Book an Appointment" }) {
  const booking = brand?.pages?.booking || {};
  const theme = brand?.theme ?? {};
  const primary = theme.primary ?? "#0D6EFD";
  const secondary = theme.secondary ?? "#111827";
  const accent = theme.accent ?? "#22C55E";

  // Choose mode
  const type = "form";

  return (
    <section id="booking" className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-10"
          style={{ color: secondary }}
        >
          {headline}
        </h2>

        {type === "embed" && booking.embedUrl && (
          <div className="rounded-2xl overflow-hidden shadow bg-white">
            <iframe
              src={booking.embedUrl}
              title="Booking"
              width="100%"
              height="720"
              style={{ border: 0 }}
              allow="camera; microphone; clipboard-read; clipboard-write"
              loading="lazy"
            />
          </div>
        )}

        {type === "link" && booking.linkUrl && (
          <div className="text-center">
            <a
              href={booking.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-2xl font-semibold shadow hover:shadow-lg transition"
              style={{
                backgroundColor: accent,
                color: theme.secondary ?? "#0B1020",
              }}
            >
              {brand?.hero?.cta || "Book Now"}
            </a>
          </div>
        )}

        {type === "form" && (
          <InlineBookingForm
            brand={brand}
            accent={accent}
            secondary={secondary}
          />
        )}
      </div>
    </section>
  );
}

function InlineBookingForm({ brand, accent, secondary }) {
  const [status, setStatus] = useState({ sending: false, ok: false, err: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });
  const formRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, ok: false, err: "" });

    try {
      // TODO: wire this to your backend or EmailJS
      // Example:
      // await fetch("/api/booking", { method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ brandId: brand?.id, ...form }) });
      // Simulate network

      await emailjs
        .sendForm(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          formRef.current,
          {
            publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
          }
        )
        .then(
          (result) => {
            setStatus({ sending: false, ok: true, err: "" });
          },
          (error) => {
            setStatus({
              sending: false,
              ok: false,
              err: "Failed to submit. Please try again.",
            });
          }
        );

      await new Promise((r) => setTimeout(r, 800)); // demo delay
      setStatus({ sending: false, ok: true, err: "" });
    } catch (err) {
      setStatus({
        sending: false,
        ok: false,
        err: "Failed to submit. Please try again.",
      });
    }
  };

  if (status.ok) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow text-center">
        <h3 className="text-2xl font-bold mb-2" style={{ color: secondary }}>
          Request received 🎉
        </h3>
        <p className="text-gray-600">
          We’ll contact you shortly to confirm your appointment.
        </p>
      </div>
    );
  }
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-2xl bg-white p-6 md:p-8 shadow grid gap-5"
    >
      <h3 className="text-2xl font-bold mb-2" style={{ color: secondary }}>
        {brand?.hero?.cta || "Book Now"}
      </h3>
      <div className="grid md:grid-cols-2 gap-5">
        <Field
          label="Name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
        <Field
          type="email"
          label="Email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <Field
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={onChange}
        />
        <Field
          label="Preferred Date"
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
        />
        <Select
          label="Service"
          name="service"
          value={form.service}
          onChange={onChange}
          options={(brand?.services || []).map((s) => ({ label: s, value: s }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={onChange}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tell us anything we should know (device, issue, preferred time)…"
        />
      </div>
      {status.err && <div className="text-red-600">{status.err}</div>}
      <button
        type="submit"
        disabled={status.sending}
        className="justify-self-start px-6 py-3 rounded-xl font-semibold shadow hover:shadow-md transition disabled:opacity-60"
        style={{ backgroundColor: accent, color: secondary }}
      >
        {status.sending ? "Sending…" : brand?.hero?.cta || "Book Now"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select…</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// https://cal.com/seim-yemane-ttudgj/30min
