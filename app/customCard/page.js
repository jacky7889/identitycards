import CustomCard from "./CustomCard";
import { DOMAIN_URL,BASE_URL,IMG_URL} from "@/libs/config";

export const metadata = {
  title: "Custom ID Card Maker | Design PVC & Plastic ID Cards Online",
  description: "Create custom PVC and plastic ID cards online. Add photos, text, shapes, and colors with our easy-to-use ID card designer. Perfect for employees, students, and membership cards.",
  keywords: "custom id card, id card designer, pvc card maker, plastic card design online, employee id card design, student id card maker, membership card designer, access card creator",

  // OpenGraph
  openGraph: {
    title: "Custom ID Card Maker | Design PVC & Plastic ID Cards Online",
    description: "Design and customize PVC identity cards using our online editor. Add images, shapes, QR codes, and more for your organization.",
    url: `${DOMAIN_URL}/customcard`,
    type: "website",
    locale: "en_IN",
    siteName: "Identity Cards Company",
    images: [
      {
        url: `${BASE_URL}/customcard-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Custom PVC ID Card Designer Online",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Custom ID Card Maker | Design PVC & Plastic ID Cards Online",
    description: "Use our online tool to create professional plastic ID cards. Easy editing and fast export.",
    images: [`${BASE_URL}/customcard-og.jpg`],
  },

  // Canonical URL
  alternates: {
    canonical: `${DOMAIN_URL}/customcard`,
  },

  // Robots meta tags
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// JSON-LD Structured Data for the Custom Card Tool
function CustomCardStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Custom ID Card Maker",
    "description": "Online tool to design and create custom PVC ID cards with photos, text, and graphics",
    "url": `${DOMAIN_URL}/customcard`,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "permissions": "browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Identity Cards Company"
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function Page() {
      return (
    <>
         <CustomCardStructuredData />
         <CustomCard />
    </>
  );
}
