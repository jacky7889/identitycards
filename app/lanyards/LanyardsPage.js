"use client";

import { useEffect, useState } from "react";
import FluctuatingCard from "./FluctuatingCard";
import { READ_URL } from "@/libs/config";


export default function LanyardsPage({ initialLanyards = [] }) {
  const [lanyards, setLanyards] = useState(initialLanyards);
  const [loading, setLoading] = useState(!initialLanyards.length);

  // If no initial data from server, fetch on client
  useEffect(() => {
    if (initialLanyards.length === 0) {
      fetch(`${READ_URL}/lanyards.php`)
        .then((res) => res.json())
        .then((data) => {
          // Ensure valid array
          if (Array.isArray(data)) {
            setLanyards(data);
          } else if (data && Array.isArray(data.data)) {
            setLanyards(data.data);
          } else {
            console.error("Unexpected response:", data);
            setLanyards([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching lanyards:", err);
          setLoading(false);
        });
    }
  }, [initialLanyards]);

  if (loading) return <p className="text-center mt-10">Loading lanyards...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Lanyards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lanyards.map((lanyard) => (
          <FluctuatingCard key={lanyard.id} lanyard={lanyard} />
        ))}
      </div>
      
      {lanyards.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No lanyards found.</p>
      )}
    </div>
  );
}