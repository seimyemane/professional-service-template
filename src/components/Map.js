export default function Map({ brand, headline = "Find Us" }) {
  const contact = brand?.contact ?? {};
  const { address, mapLink, embedMapSrc } = contact;

  const hasEmbed =
    typeof embedMapSrc === "string" && embedMapSrc.includes("/maps/embed");

  return (
    <section id="map" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          {headline}
        </h2>

        {hasEmbed ? (
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src={embedMapSrc}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map Location"
            />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white p-8 text-center">
            <p className="text-gray-700">
              Map preview unavailable. Use the button below to open Google Maps.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          {address && <p className="text-gray-700 mb-4">{address}</p>}
          {mapLink && (
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg font-semibold shadow"
              style={{
                backgroundColor: brand?.theme?.accent || "#F59E0B",
                color: brand?.theme?.secondary || "#0B1020",
              }}
            >
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
