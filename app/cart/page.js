// app/cart/page.js

import { DOMAIN_URL } from "@/libs/config";
import CartClient from "./CartClient";

// ✅ Safe & correct metadata for Cart Page
export const metadata = {
  title: "Your Cart | Identity Cards",
  description:
    "View and manage the items you selected. Review your products before proceeding to checkout.",
  robots: {
    index: false,   // ❌ Do NOT index cart pages
    follow: false,  // ❌ No need to follow links on this page
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${DOMAIN_URL}/cart`,
  },
  openGraph: {
    title: "Your Cart | Identity Cards",
    description:
      "Review the items in your cart before making a secure checkout.",
    url: `${DOMAIN_URL}/cart`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Your Cart | Identity Cards",
    description:
      "Review the items in your cart before making a secure checkout.",
  },
};

async function getCartData() {
  return [
    { id: 1, price: 500, description: "Card 1 is ribbon", ribbon: "digital dori" },
  ];
}

export default async function CartPage() {
  const initialCartData = await getCartData();

  return <CartClient initialCartData={initialCartData} />;
}
