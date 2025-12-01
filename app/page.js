import HomeClient from "./HomeClient";

export const metadata = {
  title: "Home | Custom ID Card Printing Company | PVC & Plastic Identity Cards Since 2010",
  description:
    "Trusted ID card printing company providing custom PVC, employee, student, and membership cards since 2010. Order durable, high-quality plastic ID cards with fast delivery.",
  keywords:
    "id card printing, pvc id cards, custom plastic cards, employee identity cards, student id cards, membership cards, access cards",

  // Canonical URL
  alternates: {
    canonical: "https://identitycards.co.in/",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // OpenGraph
  openGraph: {
    title: "Home | Custom ID Card Printing Company | PVC & Plastic Identity Cards Since 2010",
    description:
      "Your trusted source for custom PVC, plastic, and identity cards. Established in 2010, we deliver durable cards for businesses, schools, and events.",
    url: "https://identitycards.co.in/",
    secureUrl: "https://identitycards.co.in/",
    type: "website",
    locale: "en_IN",
    siteName: "Identity Cards Company",
    images: [
      {
        url: "https://identitycards.co.in/images/home-og.jpg",
        width: 1200,
        height: 630,
        alt: "Custom PVC ID Cards by Identity Cards Company",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Home | Custom ID Card Printing Company | PVC & Plastic Identity Cards Since 2010",
    description:
      "Professional PVC and plastic ID card printing services since 2010. Get high-quality employee, student, and membership cards.",
    images: ["https://identitycards.co.in/images/home-og.jpg"], // FIXED
  },
};



export default function Page() {
  return (
    <>
      <main>
     <HomeClient/>
     </main>
    </>
  );
}



