import Blog from "./Blog";
import { BASE_URL, DOMAIN_URL } from "@/libs/config";

export const metadata = {
  title: "Blogs | ID Card Printing Tips & Industry Insights | Blog - Your ID Card Company",
  description:
    "Read expert tips and articles on ID card printing, design ideas, plastic card technology, and identity solutions. Stay updated with our latest blog posts.",
  keywords:
    "id card printing blog, pvc card tips, plastic card design, id card ideas, identity card news",

  // Robots SEO
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

  openGraph: {
    title: "ID Card Printing Tips & Industry Insights | Blog",
    description:
      "Learn from industry experts about PVC card design, printing technology, and ID card trends. Explore our latest blog updates.",
    url: `${DOMAIN_URL}/blogs`,  
    type: "article",
    images: [
      {
        url: `${BASE_URL}/blog-og.jpg`,
        width: 1200,
        height: 630,
        alt: "ID Card Printing Blog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ID Card Printing Tips & Industry Insights | Blog",
    description:
      "Discover printing trends, design inspiration, and expert advice on custom ID cards.",
    images: [`${BASE_URL}/blog-og.jpg`],
  },
};



export default function Page() {
  return (
    <Blog/>
  );
}



