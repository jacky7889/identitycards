import { BASE_URL, DOMAIN_URL } from "@/libs/config";
import ProductClient from "./ProductClient";

export const metadata = {
  title: "Products | PVC ID Cards, Plastic ID Cards & Accessories | Best Prices in India",
  description:
    "Browse our complete range of PVC ID cards, plastic cards, lanyards, holders, and custom identity card accessories. High-quality products with fast delivery across India.",
  keywords:
    "pvc id cards, plastic id cards, id card accessories, id card holders, id card lanyards, custom id cards, id card printing products",
  
  openGraph: {
    title: "PVC ID Cards, Plastic ID Cards & Accessories | Best ID Card Products in India",
    description:
      "Discover premium PVC ID cards, plastic identity cards, lanyards, holders, and card printing products. Durable, affordable, and customized for businesses, schools, and organizations.",
    url: `${DOMAIN_URL}/products`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/products-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PVC ID Card Products and Accessories",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PVC ID Cards & Accessories | Buy Identity Card Products Online",
    description:
      "Shop PVC ID cards, plastic cards, lanyards, and holders. High-quality identity card products delivered across India.",
    images: [`${BASE_URL}/products-og.jpg`],
  },
  
  alternates: {
    canonical: `${DOMAIN_URL}/products`,
  },

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



export default function Page() {
 return (<ProductClient/>)
}
