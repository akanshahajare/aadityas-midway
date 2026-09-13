const experiences = [
  {
    number: "01",
    title: "Family Dining",
    description:
      "A comfortable place to enjoy delicious food and meaningful moments with family and friends.",
  },
  {
    number: "02",
    title: "Party & Events",
    description:
      "Celebrate birthdays, anniversaries, engagements, kitty parties and other special occasions with us.",
  },
  {
    number: "03",
    title: "Desi Flavours",
    description:
      "From Indian favourites and Punjabi dishes to Chinese, snacks and refreshing beverages.",
  },
];

const ExperienceSection = () => {
  return (
    <section className="bg-brand-green py-20 text-brand-white md:py-24">
      <div className="container-midway">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          {/* Left Content */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
              The Midway Experience
            </p>

            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold leading-tight md:text-5xl">
              More than just a place to eat.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-brand-white/75">
              Aaditya&apos;s Midway brings together good food, comfortable
              dining and memorable celebrations under one roof.
            </p>

            {/* Highlights */}
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold">
                160+ Seating
              </span>

              <span className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold">
                Family Friendly
              </span>

              <span className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold">
                Events & Parties
              </span>
            </div>
          </div>

          {/* Right Content */}
          <div className="grid gap-4">
            {experiences.map((experience) => (
              <div
                key={experience.number}
                className="group flex gap-5 rounded-2xl border border-brand-white/10 bg-brand-green-light/30 p-6 transition-all duration-300 hover:border-brand-gold/40 hover:bg-brand-green-light/50"
              >
                <span className="font-display text-2xl font-bold text-brand-gold">
                  {experience.number}
                </span>

                <div>
                  <h3 className="font-display text-xl font-bold">
                    {experience.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-brand-white/65">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;