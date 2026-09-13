import { Link } from "react-router-dom";

const events = [
  {
    icon: "🎂",
    title: "Birthdays",
    description:
      "Celebrate another year with delicious food, family and friends.",
  },
  {
    icon: "💍",
    title: "Engagements",
    description:
      "Make your special day memorable with a comfortable celebration space.",
  },
  {
    icon: "🥂",
    title: "Anniversaries",
    description:
      "Share your special moments over a meal made for the occasion.",
  },
  {
    icon: "👥",
    title: "Kitty Parties",
    description:
      "A relaxed setting for catching up, dining and spending time together.",
  },
  {
    icon: "💼",
    title: "Corporate Events",
    description:
      "Host team gatherings, meetings and corporate celebrations with ease.",
  },
  {
    icon: "❤️",
    title: "Family Gatherings",
    description:
      "Bring everyone together for food, conversations and memorable moments.",
  },
];

const EventsSection = () => {
  return (
    <section className="bg-brand-white py-20 md:py-24">
      <div className="container-midway">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
            Celebrate With Us
          </p>

          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
            Your Moments, Our Space
          </h2>

          <p className="mt-5 text-base leading-7 text-text-secondary">
            From intimate family gatherings to special celebrations, Aaditya&apos;s
            Midway is ready to make your occasion memorable.
          </p>
        </div>

        {/* Event Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.title}
              className="group rounded-2xl border border-brand-green/10 bg-brand-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-2xl">
                  {event.icon}
                </div>

                <span className="text-2xl text-brand-gold/30 transition-colors duration-300 group-hover:text-brand-gold">
                  ✦
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-bold text-brand-green">
                {event.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-brand-green p-8 text-center md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
            Planning Something Special?
          </p>

          <h3 className="mt-3 font-display text-2xl font-bold text-brand-white md:text-3xl">
            Let&apos;s make your celebration memorable.
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-brand-white/70">
            Get in touch with us to discuss your event and find the right
            arrangement for your occasion.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="tel:8435172222"
              className="btn-primary justify-center"
            >
              Call Us
            </a>

            <Link
              to="/events"
              className="btn-outline border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green justify-center"
            >
              Plan an Event
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventsSection;