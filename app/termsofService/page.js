import { DOMAIN_URL, BASE_URL } from "@/libs/config";
import TermsOfService from "./TermsOfService"; // Your terms of service component

export const metadata = {
  title: "Terms of Service | Identity Cards, PVC Cards & ID Card Manufacturer",
  description: "Read our Terms of Service for identity cards, PVC cards, custom cards, and employee ID card manufacturing. Understand our policies for design upload, ordering, and data protection.",
  keywords: "terms of service, id card terms, pvc card terms, identity card manufacturer terms, card printing policies, design upload terms, data protection cards, card manufacturing agreement",

  // Canonical URL
  alternates: {
    canonical: `${DOMAIN_URL}/terms-of-service`,
  },

  openGraph: {
    title: "Terms of Service | Identity Cards & PVC Card Manufacturer",
    description: "Complete Terms of Service for our identity card, PVC card, and custom card manufacturing services. Learn about our policies and procedures.",
    url: `${DOMAIN_URL}/terms-of-service`,
    type: "website",
    siteName: "Identity Cards India",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/terms-og.jpg`, // You can create a specific OG image for terms
        width: 1200,
        height: 630,
        alt: "Terms of Service - Identity Cards Manufacturer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Identity Cards & PVC Card Manufacturer",
    description: "Complete Terms of Service for identity card, PVC card, and custom card manufacturing services. Understand our policies.",
    images: [`${BASE_URL}/terms-og.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false, // Changed to false as terms pages are generally stable
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
  return <TermsOfService />;
}