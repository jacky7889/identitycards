"use client";

import { useEffect, useState } from "react";
import FluctuatingCard from "./FluctuatingCard";
import { READ_URL} from "@/libs/config";

export default function CardsPage({ initialCards = [] }) {
  const [cards, setCards] = useState(initialCards);
  const [loading, setLoading] = useState(!initialCards.length);

  // If no initial data from server, fetch on client
  useEffect(() => {
    if (initialCards.length === 0) {
      fetch(`${READ_URL}/cards.php`)
        .then((res) => res.json())
        .then((data) => {
          // Ensure it's an array
          if (Array.isArray(data)) {
            setCards(data);
          } else if (data && Array.isArray(data)) {
            setCards(data);
          } else {
            console.error("Unexpected response:", data);
            setCards([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching cards:", err);
          setLoading(false);
        });
    }
  }, [initialCards]);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">PVC Cards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <FluctuatingCard key={card.id} card={card} />
        ))}
      </div>
      
      {cards.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No Cards found.</p>
      )}
    </div>
  );
}