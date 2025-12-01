import Navbar from "../components/Navbar/Navbar";

export const metadata = {
  title: "Checkout | Complete Your Order",
  description: "Secure checkout process. Review your items, enter shipping & billing details, and complete your purchase.",
  keywords: "checkout, secure checkout, secure payment, order summary, billing details, shipping details, identity cards checkout, pvc card checkout, custom card checkout, payment processing, online card order, identity cards payment, finalize order, online purchase checkout",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Checkout | Complete Your Order",
    description: "Secure checkout process. Review your items and complete your purchase.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Checkout | Complete Your Order",
    description: "Secure checkout process. Review your items and complete your purchase.",
  }
}

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}