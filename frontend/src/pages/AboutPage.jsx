const AboutPage = () => {
  return (
    <main className="min-h-[70vh]">
      <section className="bg-brand-green py-20 text-brand-white">
        <div className="container-midway">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="gold-line" />

              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold-light">
                About Aaditya's
              </span>
            </div>

            <h1 className="heading-lg">
              Good food.
              <br />
              Good mood.
              <br />
              Great moments.
            </h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-midway grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="heading-md text-brand-green">
              A place to pause,
              <br />
              eat & enjoy.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-7 text-text-secondary">
            <p>
              Aaditya's Midway is a welcoming restaurant created for
              good food, relaxed conversations and memorable moments.
            </p>

            <p>
              Whether you're stopping by for a quick meal, meeting
              family and friends or planning a celebration, our space
              brings food and hospitality together.
            </p>

            <p className="font-display text-xl italic text-brand-brown">
              “Desi Touch — जो दिल जीत दे”
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;