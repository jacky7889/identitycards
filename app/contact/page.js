import ContactClient from "./ContactClient";
import { DOMAIN_URL,BASE_URL, READ_URL} from "@/libs/config";

export const metadata = {
  title: "Contact Us | Identity Cards – PVC & Plastic ID Card Printing Since 2010",
  description:
    "Contact Identity Cards for PVC, plastic, employee, and student ID card printing services. Get support, bulk pricing, or a custom quotation. Fast response guaranteed.",
  keywords:
    "contact identity cards, pvc card printing contact, plastic card support, id card enquiry, custom id card quote, pvc id card manufacturer",

  // Open Graph
  openGraph: {
    title: "Contact Us | Identity Cards – PVC & Plastic ID Card Printing Since 2010",
    description:
      "Reach out for enquiries, custom ID card designs, bulk PVC card orders, or technical support. Identity Cards has served schools, corporates & institutions since 2010.",
    url: `${DOMAIN_URL}/contact`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/contact-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Identity Cards – PVC ID Card Printing",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Identity Cards – PVC & Plastic ID Card Printing Since 2010",
    description:
      "Contact Identity Cards for custom PVC ID card printing, quotes, and support. Talk to our expert team today.",
    images: [`${BASE_URL}/contact-og.jpg`],
  },

  // SEO Robots
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

  // Canonical URL
  alternates: {
    canonical: `${DOMAIN_URL}/contact`,
  },
};


async function getContactData() {
  try {
    const res = await fetch(`${READ_URL}/contact_locations.php`, {
      // Add cache revalidation if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
        
    if (data.data && data.data[0]) {
      const row = data.data[0];
      return {
        contactAdd: row.contact,
        contactEmails: row.emails ? row.emails.split(",") : [],
        contactNumbers: row.numbers ? row.numbers.split(",") : [],
        map: row.map,
        contactStatus: Number(row.contact_status),
        mapStatus: Number(row.map_status)
      };
    } else {
      throw new Error("No contact data found");
    }
  } catch (error) {
    console.error("Error fetching contact data:", error);
    // Return fallback data
    return {
      contactAdd: "123 Business Street, City, State 12345",
      contactEmails: ["info@creationgraphicss.com", "creationgraphicss@gmail.com"],
      contactNumbers: ["+1 234 567 8900", "+1 234 567 8901"],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.177634257477!2d-74.00594908459418!3d40.71274377933085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a315c0f85d3%3A0x6783f19b4c935aae!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890",
      contactStatus: 1,
      mapStatus: 1
    };
  }
}

export default async function Contact() {
  const contactData = await getContactData();

  return <ContactClient initialData={contactData} />;
}