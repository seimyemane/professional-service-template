export default function Footer({ brand }) {
  return (
    <footer
      className="mt-16 py-10 text-white"
      style={{ backgroundColor: brand.theme?.secondary || "#111827" }}
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Brand Info */}
        <div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: brand.theme?.primary || "#10B981" }}
          >
            {brand.logoText || brand.brandName}
          </h2>
          <p className="text-gray-300">
            {brand.hero?.subtitle ||
              "We’re here to provide excellent service and care."}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#services" className="hover:underline">
                Services
              </a>
            </li>
            <li>
              <a href="#gallery" className="hover:underline">
                Gallery
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a
                href={brand?.pages?.booking?.embedUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {brand.hero?.cta || "Book Now"}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-300">{brand.contact?.phone}</p>
          <p className="text-gray-300">{brand.contact?.email}</p>
          <p className="text-gray-300">{brand.contact?.address}</p>
          {brand.contact?.mapLink && (
            <a
              href={brand.contact.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 rounded-lg font-medium shadow"
              style={{
                backgroundColor: brand.theme?.accent || "#F59E0B",
                color: brand.theme?.secondary || "#0B1020",
              }}
            >
              View on Map
            </a>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {brand.brandName}. All rights reserved.
        Powered by{" "}
        <a
          href="http://www.thedevicelab.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          DeviceLab
        </a>
      </div>
    </footer>
  );
}
