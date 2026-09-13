const EventsPage = () => {
  const events = [
    "Birthdays",
    "Anniversaries",
    "Engagements",
    "Kitty Parties",
    "Corporate Events",
    "Family Gatherings",
  ];

  return (
    <main className="min-h-[70vh]">
      <section className="bg-brand-green py-20 text-brand-white">
        <div className="container-midway">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="gold-line" />

              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold-light">
                Celebrate with us
              </span>
            </div>

            <h1 className="heading-lg">
              Your moments,
              <br />
              <span className="text-brand-gold">
                our space.
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-midway">
          <div className="max-w-2xl">
            <h2 className="heading-md text-brand-green">
              Make your celebration memorable
            </h2>

            <p className="mt-5 leading-7 text-text-secondary">
              From intimate family gatherings to larger celebrations,
              Aaditya's Midway offers a comfortable setting for your
              special occasions.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event}
                className="card-midway p-6"
              >
                <span className="text-sm font-semibold text-brand-gold">
                  EVENT
                </span>

                <h3 className="mt-3 font-display text-2xl font-semibold text-brand-green">
                  {event}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <a
              href="tel:8435172222"
              className="btn-primary inline-flex"
            >
              Enquire About Events
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventsPage;