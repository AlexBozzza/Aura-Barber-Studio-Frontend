
import MainLayout from "../layouts/MainLayout";

import Hero from "../components/home/Hero";
import ServicesPreview from "../components/home/ServicesPreview";
import AboutSection from "../components/home/AboutSection";
import ReviewsSection from "../components/home/ReviewsSection";

function Home() {
    return (
        <MainLayout>
            <Hero />
            <ServicesPreview />
            <AboutSection />
            <ReviewsSection />
        </MainLayout>
    );
}

export default Home;
