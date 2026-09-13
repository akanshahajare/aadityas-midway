import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green-dark text-brand-white">
      <div className="container-midway">

        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Aaditya's Midway home"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-green">
                <span className="font-display text-xl font-bold text-brand-gold">
                  A
                </span>
              </div>

              <div className="leading-none">
                <p className="font-display text-xl font-bold tracking-wide">
                  AADITYA&apos;S
                </p>

                <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  Midway & Restaurant
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-brand-white/65">
              Good food, good mood. A warm and welcoming destination for
              delicious food, family moments and memorable celebrations.
            </p>

            <p className="mt-5 font-display text-lg font-semibold text-brand-gold">
              हर जायके में प्यार
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Quick Links
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-brand-white/65 transition-colors hover:text-brand-gold"
              >
                Home
              </Link>

              <Link
                to="/menu"
                className="text-sm text-brand-white/65 transition-colors hover:text-brand-gold"
              >
                Menu
              </Link>

              <Link
                to="/about"
                className="text-sm text-brand-white/65 transition-colors hover:text-brand-gold"
              >
                About Us
              </Link>

              <Link
                to="/events"
                className="text-sm text-brand-white/65 transition-colors hover:text-brand-gold"
              >
                Events
              </Link>

              <Link
                to="/contact"
                className="text-sm text-brand-white/65 transition-colors hover:text-brand-gold"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Visit Us
            </h3>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                  Location
                </p>

                <p className="mt-2 text-sm leading-6 text-brand-white/65">
                  Gokuldham — Aaditya Smart City
                  <br />
                  Kairitaigaon, Nagpur–Chhindwara Road
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                  Phone
                </p>

                <a
                  href="tel:8435172222"
                  className="mt-2 block text-sm font-semibold text-brand-white/75 transition-colors hover:text-brand-gold"
                >
                  +91 84351 72222
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-brand-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 py-6 text-xs text-brand-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Aaditya&apos;s Midway & Restaurant. All rights
            reserved.
          </p>

          <p>
            Good Food • Good Mood
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;