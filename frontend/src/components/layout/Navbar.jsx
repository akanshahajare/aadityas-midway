import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-green/10 bg-brand-white/95 backdrop-blur-md">
      <div className="container-midway">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
            aria-label="Aaditya's Midway home"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand-gold bg-brand-green">
              <span className="font-display text-lg font-bold text-brand-gold">
                A
              </span>
            </div>

            <div className="leading-none">
              <p className="font-display text-lg font-bold tracking-wide text-brand-green">
                AADITYA'S
              </p>
              <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-brand-brown">
                Midway & Restaurant
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="relative text-sm font-semibold text-text-primary transition-colors duration-200 hover:text-brand-green"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-brand-green/20 text-brand-green transition hover:bg-brand-cream"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-green-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/menu" className="btn-primary">
              Explore Menu
            </Link>

            <a href="tel:8435172222" className="btn-secondary">
              Call Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-green/20 text-brand-green transition hover:bg-brand-cream lg:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-brand-green/10 py-5 lg:hidden">
            <nav
              className="flex flex-col gap-1"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-brand-cream hover:text-brand-green"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-brand-green/10 pt-4">
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="relative flex items-center justify-center rounded-lg border border-brand-green/20 py-3 text-sm font-semibold text-brand-green"
              >
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-brand-green-dark">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/menu"
                onClick={closeMobileMenu}
                className="btn-primary"
              >
                Menu
              </Link>

              <a
                href="tel:8435172222"
                onClick={closeMobileMenu}
                className="btn-secondary"
              >
                Call
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;