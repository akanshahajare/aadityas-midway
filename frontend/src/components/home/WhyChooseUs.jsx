import { Link } from "react-router-dom";

const features = [
  {
    icon: "🍽️",
    title: "Good Food",
    description:
      "A diverse menu filled with Indian favourites, Punjabi flavours, Chinese dishes, snacks, beverages and more.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Family Moments",
    description:
      "A comfortable and welcoming place where families and friends can sit together, relax and enjoy good food.",
  },
  {
    icon: "🎉",
    title: "Celebrations",
    description:
      "Make birthdays, anniversaries, engagements, kitty parties and other special occasions memorable.",
  },
  {
    icon: "✨",
    title: "Midway Experience",
    description:
      "More than a meal — enjoy a convenient midway stop with great food, comfortable seating and a warm atmosphere.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-brand-white py-20 md:py-24">
      <div className="container-midway">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-gold">
            Why Aaditya&apos;s Midway
          </p>

          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
            Desi Touch — जो दिल जीत दे
          </h2>

          <p className="mt-5 text-base leading-7 text-text-secondary">
            From everyday meals to special celebrations, we bring together
            delicious food and memorable moments.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-brand-green/10 bg-brand-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-2xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="mt-6 font-display text-xl font-bold text-brand-green">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center font-semibold text-brand-green transition-colors duration-200 hover:text-brand-gold"
          >
            Discover our menu
            <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;