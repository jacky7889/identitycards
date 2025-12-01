import { DOMAIN_URL, BASE_URL } from "@/libs/config";
import PrivacyPolicy from "./PrivacyPolicy";

export const metadata = {
  title: "Privacy Policy | Identity Cards, PVC Cards & ID Card Manufacturer",
  description: "Read our comprehensive Privacy Policy for identity card, PVC card, and custom card manufacturing services. Learn how we protect your data and ensure security.",
  keywords: "privacy policy, data protection, id card privacy, pvc card data security, identity card manufacturer privacy, data retention, information security, gdpr compliance india",

  // Canonical URL
  alternates: {
    canonical: `${DOMAIN_URL}/privacy-policy`,
  },

  openGraph: {
    title: "Privacy Policy | Identity Cards & PVC Card Manufacturer",
    description: "Comprehensive Privacy Policy for our identity card and PVC card manufacturing services. Your data security is our priority.",
    url: `${DOMAIN_URL}/privacy-policy`,
    type: "website",
    siteName: "Identity Cards India",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/privacy-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Identity Cards Manufacturer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Identity Cards & PVC Card Manufacturer",
    description: "Complete Privacy Policy for identity card and PVC card manufacturing services. Learn about our data protection measures.",
    images: [`${BASE_URL}/privacy-og.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function Page() {
  return <PrivacyPolicy />;
}