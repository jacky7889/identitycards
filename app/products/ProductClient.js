"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


export default function ProductClient() {
  const [filter, setFilter] = useState("*");
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);

  const products = [
    {
      image: "/images/img01.jpg",
      title: "PVC ID Cards",
      text: "We provide PVC Card, Identity Card for Institution & Companies.",
    },
    {
      image: "/images/img02.jpg",
      title: "Magnetic Striping Card",
      text: "Magnetic Stripped card stores embossed information.",
    },
    {
      image: "/images/img03.jpg",
      title: "Official Dori",
      text: "We provide ID Card Dori for Corporate Companies.",
    },
    {
      image: "/images/img04.jpg",
      title: "Digital Lanyard / Dori",
      text: "We provide Digitally printed Lanyard / Dori.",
    },
  ];

  const items = [
    {
      id: 1,
      category: "objects",
      title: "Holders",
      image: "/images/holders.png",
      gallery: ["/images/holders/holder1.jpg","/images/holders/holder2.jpg","/images/holders/holder3.jpg","/images/holders/holder4.jpg"],
      desc: "Various kinds of Identity Cards Holder",
    },
    {
      id: 2,
      category: "places",
      title: "PVC ID Cards",
      image: "/images/cards.png",
      gallery: ["/images/cards/cards1.jpg","/images/cards/cards2.jpg","/images/cards/cards3.jpg","/images/cards/cards4.jpg"],
      desc: "PVC ID Cards, Identity Cards",
    },
    {
      id: 3,
      category: "people",
      title: "Digital Lanyard / Dori",
      image: "/images/dori.png",
      gallery: ["/images/dori/dori01.jpg","/images/dori/dori02.jpg","/images/dori/dori03.jpg","/images/dori/dori04.jpg"],
      desc: "Digital printed Lanyard / Dori",
    },
  ];

  const filters = [
    { label: "All", value: "*" },
    { label: "ID Cards", value: "places" },
    { label: "Dori/Lanyard", value: "people" },
    { label: "Holder/Case", value: "objects" },
  ];

  const filtered = filter === "*" ? items : items.filter((i) => i.category === filter);

  return (
    <>
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">

 {/* Product Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Our <span className="text-blue-600">Product</span>
          </h1>
          <p className="italic text-gray-500">
            Our PVC Identity Cards Accessories for making a CARD
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {products.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <Image
                width={350}
                height={200}
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 text-center">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
        </section>


 <section className="py-20">
      <div className="container mx-auto px-6 text-center">

        <h1 className="text-3xl font-bold mb-4">
          Identity <span className="text-blue-600">Cards</span>
        </h1>
        <p className="text-gray-500 mb-10">
          We create identity cards for Corporate Offices, Government Organisations and MNC Companies
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                filter === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-600 hover:bg-blue-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition cursor-pointer"
              onClick={() => {
                setSlides(item.gallery.map((src) => ({ src })));
                setOpen(true);
              }}
            >
              <Image src={item.image} alt={item.title} width={400} height={300} className="w-full h-60 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <i className="fa fa-search fa-3x text-white"></i>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
    </section>
    </>
  );
}
