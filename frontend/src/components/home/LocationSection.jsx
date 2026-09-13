import { Link } from "react-router-dom";

const LocationSection = () => {
  return (
    <section className="bg-brand-white py-20 md:py-24">
      <div className="container-midway">
        <div className="grid overflow-hidden rounded-3xl bg-brand-green lg:grid-cols-2">

          {/* Location Information */}
          <div className="p-8 md:p-12 lg:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
              Find Us
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-white md:text-5xl">
              Stop by for a Good Meal.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-brand-white/70">
              Whether you&apos;re travelling through or looking for a place to
              spend time with family and friends, Aaditya&apos;s Midway is here
              to welcome you.
            </p>

            {/* Address */}
            <div className="mt-8 flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold text-lg">
                📍
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                  Address
                </p>

                <p className="mt-2 text-sm leading-7 text-brand-white/80">
                  Gokuldham — Aaditya Smart City
                  <br />
                  Kairitaigaon, Nagpur–Chhindwara Road
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-6 flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold text-lg">
                📞
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                  Call Us
                </p>

                <a
                  href="tel:8435172222"
                  className="mt-2 block text-sm font-semibold text-brand-white transition-colors hover:text-brand-gold"
                >
                  +91 84351 72222
                </a>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:8435172222"
                className="btn-primary justify-center"
              >
                Call Restaurant
              </a>

              <Link
                to="/contact"
                className="btn-outline justify-center border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative min-h-[350px] bg-brand-green-dark lg:min-h-full">
            {/* Decorative map-style background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute left-[10%] top-[20%] h-px w-[80%] rotate-[15deg] bg-brand-gold" />
              <div className="absolute left-[5%] top-[55%] h-px w-[90%] -rotate-[12deg] bg-brand-gold" />
              <div className="absolute left-[25%] top-[10%] h-[90%] w-px rotate-[20deg] bg-brand-gold" />
              <div className="absolute right-[25%] top-[5%] h-[95%] w-px -rotate-[35deg] bg-brand-gold" />

              <div className="absolute left-[15%] top-[35%] h-32 w-32 rounded-full border border-brand-gold" />
              <div className="absolute bottom-[15%] right-[10%] h-48 w-48 rounded-full border border-brand-gold" />
            </div>

            {/* Location Pin */}
            <div className="relative flex h-full min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-green text-3xl shadow-xl">
                  📍
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold text-brand-white">
                  Aaditya&apos;s Midway
                </h3>

                <p className="mt-2 text-sm text-brand-white/60">
                  Gokuldham — Aaditya Smart City
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Aaditya%27s+Midway+Gokuldham+Aaditya+Smart+City+Kairitaigaon+Nagpur+Chhindwara+Road"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center font-semibold text-brand-gold transition-colors hover:text-brand-white"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationSection;