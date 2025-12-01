import HeroSlider from "./HeroSlider";
import {IMG_URL, READ_URL} from "@/libs/config";

export default async function Hero() {
 

  async function getBannerImages() {
    try {
      const res = await fetch(
        `${READ_URL}/banners.php`,
        { cache: "no-store" } // SSR fresh fetch
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.error("Banner fetch failed:", err);
    }

    // Fallback banners
    return [
      {
        id: 1,
        image: "slider1.jpg",
        title: "Welcome to Identity Cards",
        description:
          "We create professional and customized ID cards for schools, companies, and institutions.",
        buttonText: "Get Started",
      },
      {
        id: 2,
        image: "slider2.jpg",
        title: "Premium Quality ID Cards",
        description:
          "High-quality materials and advanced security features for your identification needs.",
        buttonText: "Learn More",
      },
      {
        id: 3,
        image: "slider3.jpg",
        title: "Custom Design Solutions",
        description:
          "Tailored ID card designs that match your organization’s branding.",
        buttonText: "View Portfolio",
      },
    ];
  }

  const bannerImages = await getBannerImages();

  return <HeroSlider bannerImages={bannerImages} baseUrl={IMG_URL} />;
}
