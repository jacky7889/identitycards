"use client";

import { useState, useEffect } from "react";
import FluctuatingCard from "./FluctuatingCard";
import { READ_URL } from "@/libs/config";

export default function HoldersPage({ initialHolders = [] }) {
  const [holders, setHolders] = useState(initialHolders);
  const [loading, setLoading] = useState(!initialHolders.length);

  // If no initial data from server, fetch on client
  useEffect(() => {
    if (initialHolders.length === 0) {
      fetch(`${READ_URL}/holders.php`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setHolders(data);
          } else if (data && Array.isArray(data.data)) {
            setHolders(data.data);
          } else {
            console.error("Unexpected response:", data);
            setHolders([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching holders:", err);
          setLoading(false);
        });
    }
  }, [initialHolders]);

  if (loading) return <p className="text-center mt-10">Loading holders...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">ID Card Holders</h2>
      {holders.length === 0 ? (
        <p className="text-center text-gray-600">No holders available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {holders.map((holder) => (
            <FluctuatingCard key={holder.id} holder={holder} />
          ))}
        </div>
      )}
    </div>
  );
}