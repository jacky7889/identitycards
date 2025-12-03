import { DOMAIN_URL, BASE_URL } from "@/libs/config";
import CancellationRefundPolicy from "./CancellationRefundPolicy";

export const metadata = {
  title: "Cancellation & Refund Policy | Identity Cards & PVC Card Manufacturer",
  description: "Clear cancellation and refund policy for identity cards, PVC cards, and custom card orders. Understand our terms for order modifications and quality issues.",
  keywords: "cancellation policy, refund policy, id card cancellation, pvc card refund, order modification, card manufacturing policy, quality guarantee, return policy",

  // Canonical URL
  alternates: {
    canonical: `${DOMAIN_URL}/cancellation-refund-policy`,
  },

  openGraph: {
    title: "Cancellation & Refund Policy | Identity Cards Manufacturer",
    description: "Complete cancellation and refund policy for our identity card and PVC card manufacturing services. Know your rights and our procedures.",
    url: `${DOMAIN_URL}/cancellation-refund-policy`,
    type: "website",
    siteName: "Identity Cards India",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/cancellation-policy-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Cancellation & Refund Policy - Identity Cards Manufacturer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cancellation & Refund Policy | Identity Cards Manufacturer",
    description: "Clear cancellation and refund terms for identity card and PVC card orders. Understand our manufacturing process policies.",
    images: [`${BASE_URL}/cancellation-policy-og.jpg`],
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
  return <CancellationRefundPolicy />;
}