"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {IMG_URL} from "@/libs/config";

export default function FluctuatingCard({ card }) {
  const[user, setUser] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
 useEffect(() => {
  const userSignin = localStorage.getItem("isSignedIn");
  setUser(userSignin);
}, []);
  
  useEffect(() => {
    if (card.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % card.images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
 
  }, [card.images.length]);
  

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative w-full h-60 bg-gray-50">
        <Image
          src={`${IMG_URL}/${card.images[currentImage]}`}
          alt={card.card_name}
          fill
          className="object-contain transition-all duration-700 ease-in-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />

              
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">{card.card_name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{card.card_detail}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {user ? (<span className="text-lg font-semibold text-blue-600">₹{card.price}</span>) : ""
          }
          <Link
            href={`/cards/${card.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
          >
            Add
          </Link>
        </div>
      </div>
    </div>
  );
}
