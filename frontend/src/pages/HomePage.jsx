import Hero from "../components/home/Hero";
import WhyChooseUs from "../components/home/WhyChooseUs";
import FeaturedMenu from "../components/home/FeaturedMenu";
import ExperienceSection from "../components/home/ExperienceSection";
import EventsSection from "../components/home/EventsSection";
import GallerySection from "../components/home/GallerySection";
import LocationSection from "../components/home/LocationSection";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <FeaturedMenu />
      <ExperienceSection />
      <EventsSection />
      <GallerySection />
      <LocationSection />
    </main>
  );
};

export default HomePage;