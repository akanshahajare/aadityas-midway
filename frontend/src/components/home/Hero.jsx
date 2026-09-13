import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="container-midway">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          {/* Left Content */}
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">
              Aaditya&apos;s Midway & Restaurant
            </p>

            <h1 className="font-display text-5xl font-bold leading-[1.05] text-brand-green md:text-6xl lg:text-7xl">
              Good Food,
              <span className="block text-brand-gold">Good Mood.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
              A warm and welcoming destination for delicious food, family
              moments and celebrations. Come hungry, leave happy.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/menu"
                className="btn-primary justify-center"
              >
                Explore Menu
              </Link>

              <a
                href="tel:8435172222"
                className="btn-outline justify-center"
              >
                Call Restaurant
              </a>
            </div>

            {/* Highlights */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-brand-green/10 pt-7">
              <div>
                <p className="font-display text-2xl font-bold text-brand-green">
                  160+
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Seating
                </p>
              </div>

              <div>
                <p className="font-display text-2xl font-bold text-brand-green">
                  Family
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Friendly
                </p>
              </div>

              <div>
                <p className="font-display text-2xl font-bold text-brand-green">
                  Events
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
                  & Parties
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-[560px] overflow-hidden rounded-[2rem] bg-brand-green shadow-2xl">
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[30px] border-brand-gold" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border-[35px] border-brand-gold" />
              </div>

              {/* Restaurant branding placeholder */}
              <div className="relative flex h-full flex-col items-center justify-center p-10 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-green-dark">
                  <span className="font-display text-5xl font-bold text-brand-gold">
                    A
                  </span>
                </div>

                <p className="mt-7 font-display text-3xl font-bold text-brand-white">
                  AADITYA&apos;S
                </p>

                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
                  Midway & Restaurant
                </p>

                <div className="mt-7 h-px w-24 bg-brand-gold/60" />

                <p className="mt-6 max-w-xs text-sm leading-7 text-brand-white/70">
                  Desi Touch — जो दिल जीत दे
                </p>
              </div>
            </div>

            {/* Location Card */}
            <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-brand-green/10 bg-brand-white p-5 shadow-xl sm:left-auto sm:right-6 sm:w-80">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                Visit Us
              </p>

              <p className="mt-2 font-display text-lg font-bold text-brand-green">
                Gokuldham — Aaditya Smart City
              </p>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Kairitaigaon, Nagpur–Chhindwara Road
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;