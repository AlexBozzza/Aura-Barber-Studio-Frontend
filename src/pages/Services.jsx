import MainLayout from "../layouts/MainLayout";

import ServicesHero from "../components/services/ServicesHero";
import ServicesIntro from "../components/services/ServicesIntro";
import ServicesList from "../components/services/ServicesList";
import ServicesCTA from "../components/services/ServicesCTA";

function Services() {
  return (
    <MainLayout>
      <ServicesHero />
      <ServicesIntro />
      <ServicesList />
      <ServicesCTA />
    </MainLayout>
  );
}

export default Services;