const ContactPage = () => {
  return (
    <main className="min-h-[70vh]">
      <section className="bg-brand-green py-20 text-brand-white">
        <div className="container-midway">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="gold-line" />

              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold-light">
                Get in touch
              </span>
            </div>

            <h1 className="heading-lg">
              Come say
              <br />
              <span className="text-brand-gold">
                hello.
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-midway grid gap-8 md:grid-cols-2">

          <div className="card-midway p-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Visit us
            </span>

            <h2 className="mt-4 font-display text-2xl font-semibold text-brand-green">
              Aaditya's Midway
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
              Gokuldham - Aaditya Smart City,
              <br />
              Kairitaigaon,
              <br />
              Nagpur–Chhindwara Road.
            </p>
          </div>

          <div className="card-midway p-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Call us
            </span>

            <h2 className="mt-4 font-display text-2xl font-semibold text-brand-green">
              8435172222
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
              Call the restaurant for enquiries, reservations and
              celebration arrangements.
            </p>

            <a
              href="tel:8435172222"
              className="btn-primary mt-6 inline-flex"
            >
              Call Restaurant
            </a>
          </div>

        </div>
      </section>
    </main>
  );
};

export default ContactPage;