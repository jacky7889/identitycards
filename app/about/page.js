import { DOMAIN_URL,BASE_URL} from "@/libs/config";
// app/about/page.js

export const metadata = {
  title: "About Us | Leading ID Card Manufacturer in India Since 2010",
  description:
    "Learn about our journey as one of India’s most trusted ID card manufacturers. Since 2010, we’ve specialized in producing durable PVC and plastic identity cards for schools, corporates, and events.",
  keywords:
    "id card company india, plastic card manufacturer, pvc card printer, zebra printer, zebra printer ribbons, custom id card supplier, id card manufacturer india, pvc id card printing",

  // Canonical URL
  alternates: {
    canonical: `${DOMAIN_URL}/about`,
  },

  openGraph: {
    title: "About Us | Leading ID Card Manufacturer in India Since 2010",
    description:
      "We’ve been manufacturing high-quality PVC and plastic ID cards since 2010. Trusted by corporates, schools, and organizations across India.",
    url: `${DOMAIN_URL}/about`,
    type: "website",
    siteName: "Identity Cards India",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/about-og.jpg`,
        width: 1200,
        height: 630,
        alt: "About Identity Cards – Leading PVC Card Manufacturer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us | Leading ID Card Manufacturer in India Since 2010",
    description:
      "Trusted PVC & plastic ID card manufacturer since 2010. Discover our story and commitment to quality identity solutions.",
    images: [`${BASE_URL}/about-og.jpg`],
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

 
export default function About() {
  
  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-2">About Us — <span className="text-blue-600">Your Trusted ID Card Experts Since 2010</span></h1>
      <div className="pt-5 space-y-4">
      <p>Welcome to Creation Graphics, a leading manufacturer and supplier of custom ID cards, plastic cards, and identity solutions. Since our founding in 2010, we’ve been dedicated to delivering high-quality, durable, and visually striking cards that help businesses, schools, and organizations stand out with confidence.</p>
      <p>With over a decade of experience, we specialize in creating a wide range of products — including PVC ID cards, employee cards, membership cards, RFID access cards, loyalty cards, and student ID cards — all tailored to meet your unique branding and security needs.</p>
       <p>At Creation Graphics, we believe that an ID card is more than just identification — it’s a reflection of your brand’s identity and professionalism. That’s why we use premium materials, advanced printing technology, and secure design processes to ensure every card we produce meets the highest standards of quality.</p>

      <ul className="py-2 space-y-2">
       <li>Our mission is simple:</li> 
      <li>✅ To provide affordable, reliable, and customizable ID card solutions.</li>
      <li>✅ To offer quick turnaround times and exceptional customer service.</li>
      <li>✅ To help every client create a lasting first impression with their cards.</li>
      </ul>

      <p>From small startups to large corporations, thousands of clients across industries trust us for their ID card printing and design needs. Whether you need cards in bulk or a one-time custom design, we’ve got you covered — with precision, passion, and professionalism.</p>
       </div>
      </div>
    </section>
  );
}
