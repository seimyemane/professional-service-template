export default function FAQ({
  brand,
  headline = "Frequently Asked Questions",
}) {
  const items = brand?.pages?.faq?.items ?? brand?.faq ?? [];

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          {headline}
        </h2>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-gray-200 bg-gray-50 open:bg-white open:shadow"
            >
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  {item.q}
                </span>
                <span className="ml-4 shrink-0 rounded-full w-8 h-8 grid place-items-center border border-gray-300 text-gray-600 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Optional: SEO structured data for FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((it) => ({
              "@type": "Question",
              name: it.q,
              acceptedAnswer: { "@type": "Answer", text: it.a },
            })),
          }),
        }}
      />
    </section>
  );
}
