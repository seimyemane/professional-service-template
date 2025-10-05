export default function About({ brand }) {
  const about = brand?.pages?.about;
  if (!about) return null;

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Headline + Blurb */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6">
          {about.headline || "About Us"}
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
          {about.blurb ||
            "We are dedicated to providing excellent service and building lasting relationships with our clients."}
        </p>

        {/* Team Section */}
        {about.team && about.team.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
              Meet Our Team
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {about.team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
