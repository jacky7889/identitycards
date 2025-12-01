// app/cart/CartClient.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IMG_URL, CREATE_URL } from "@/libs/config";

export default function CartClient() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isSignedIn, setSignedIn] = useState(false);

  const [priceSummary, setPriceSummary] = useState({
    totalPrice: 0,
    totalWeight: 0,
    shippingCost: 0,
    grandTotal: 0,
  });

  // ===============================
  // Calculate totals
  // ===============================
  const calculateTotals = (items) => {
    if (!items.length) {
      return {
        totalPrice: 0,
        totalWeight: 0,
        shippingCost: 0,
        grandTotal: 0,
      };
    }

    // Subtotal
    const totalPrice = items
      .reduce((sum, i) => sum + i.quantity * (i.price || 0), 0)
      .toFixed(2);

    // Weight (5g per quantity)
    const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
    const totalWeight = totalQuantity * 5; // grams

    // Shipping calculation
    let shippingCost = 0;
    if (totalWeight <= 250) shippingCost = 80;
    else if (totalWeight <= 500) shippingCost = 100;
    else if (totalWeight <= 800) shippingCost = 200;
    else if (totalWeight <= 1000) shippingCost = 300;
    else shippingCost = 300 + (totalWeight - 1000) * 10;

    const grandTotal = (Number(totalPrice) + shippingCost).toFixed(2);

    return {
      totalPrice,
      totalWeight,
      shippingCost,
      grandTotal,
    };
  };

  // ===============================
  // Load cart from localStorage
  // ===============================
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const signInStatus = localStorage.getItem("isSignedIn");

    setUser(userId);
    setSignedIn(signInStatus);

    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Remove null/empty objects
    const cleanedCart = savedCart.filter(
      (item) => item && Object.keys(item).length > 0
    );

    // Update storage if cleaned
    if (cleanedCart.length !== savedCart.length) {
      localStorage.setItem("cartItems", JSON.stringify(cleanedCart));
    }

    setCartItems(cleanedCart);
  }, []);

  // ===============================
  // Recalculate totals on cart change
  // ===============================
  useEffect(() => {
    const totals = calculateTotals(cartItems);
    setPriceSummary(totals);

    localStorage.setItem("totalPrice", totals.totalPrice);
    localStorage.setItem("totalWeight", totals.totalWeight);
    localStorage.setItem("shippingCost", totals.shippingCost);
    localStorage.setItem("grandTotal", totals.grandTotal);
  }, [cartItems]);

  // ===============================
  // Update quantity
  // ===============================
  const updateQuantity = (index, qty) => {
    if (qty < 1) return;

    const updated = [...cartItems];
    updated[index].quantity = qty;

    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  // ===============================
  // Remove Item from cart
  // ===============================
  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    
    localStorage.setItem("cartItems", JSON.stringify(updated));

    // Remove totals so fresh values get calculated
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("totalWeight");
    localStorage.removeItem("shippingCost");
    localStorage.removeItem("grandTotal");
    window.dispatchEvent(new Event("storage"));
  };

  // ===============================
  // Group by category
  // ===============================
  const grouped = cartItems.reduce((acc, item, index) => {
    if (!item) return acc;

    const category = item.category || "uncategorized";
    if (!acc[category]) acc[category] = [];

    acc[category].push({ ...item, _globalIndex: index });
    return acc;
  }, {});

  const { totalPrice, shippingCost, grandTotal } = priceSummary;

  // ===============================
  // Checkout handler
  // ===============================
  const handleCheckOut = async () => {
    try {
      const res = await fetch(
        `${CREATE_URL}/add_carts.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user,
            cartItems,
            totalPrice,
            shippingCost,
            grandTotal,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Items added to cart successfully!");
        router.push("/checkout");
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error connecting to server");
      console.error(err);
    }
  };

  // ===============================
  // If empty cart
  // ===============================
  if (!cartItems.length) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 text-center mt-8 md:mt-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Item yet</h3>
            <p className="text-gray-500 mb-6">{`You haven't placed any Items with us yet.`}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors w-full sm:w-auto"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // UI Rendering
  // ===============================
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Your Cart</h2>
        <Link
          href="/cards"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base w-full sm:w-auto text-center"
        >
          Add More Items
        </Link>
      </div>

      {/* Cart Items - Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Category Header */}
            <div className="bg-gray-200 p-3">
              <h3 className="font-bold uppercase text-gray-700">{category}</h3>
            </div>
            
            {/* Items */}
            <div className="divide-y">
              {items.map((item) => (
                <div key={item._globalIndex} className="p-4">
                  <div className="flex gap-3">
                    {/* Image */}
                    {item.image ? (
                      <div className="flex-shrink-0">
                        <Image
                          width={80}
                          height={80}
                          src={`${IMG_URL}/${
                            Array.isArray(item.image) ? item.image[0] : item.image
                          }`}
                          alt={item.title || "Cart item"}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md border flex-shrink-0">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                      
                      {/* Item Properties */}
                      <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                        {item.side && <div>Side: {item.side}</div>}
                        {item.size && <div>Size: {item.size}</div>}
                        {item.hook && <div>Hook: {item.hook}</div>}
                        {item.text && <div>Text: {item.text}</div>}
                        {item.material && <div>Material: {item.material}</div>}
                        {item.orientation && <div>Orientation: {item.orientation}</div>}
                        {item.quality && <div>Quality: {item.quality}</div>}
                        {item.design && <div>Design: {item.design}</div>}
                        {item.fileName && <div className="truncate">File: {item.fileName}</div>}
                        {item.feature && <div>Feature: {item.feature}</div>}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700 font-medium text-sm">
                          ₹{Number(item.price || 0).toFixed(2)}
                        </span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded w-24">
                          <button
                            onClick={() => updateQuantity(item._globalIndex, item.quantity - 1)}
                            className="bg-red-700 text-white px-2 py-1 hover:bg-red-800 text-sm"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item._globalIndex, parseInt(e.target.value))
                            }
                            className="w-full text-center outline-none text-sm py-1"
                          />
                          <button
                            onClick={() => updateQuantity(item._globalIndex, item.quantity + 1)}
                            className="bg-red-700 text-white px-2 py-1 hover:bg-red-800 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total and Remove */}
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-800 text-sm">
                          Total: ₹{(item.quantity * (item.price || 0)).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item._globalIndex)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Items - Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-gray-50 border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700 w-2/5">Item</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
              <th className="p-4 font-semibold text-gray-700">Quantity</th>
              <th className="p-4 font-semibold text-gray-700">Total</th>
            </tr>
          </thead>

          {Object.entries(grouped).map(([category, items]) => (
            <tbody key={category}>
              <tr className="bg-gray-200">
                <td colSpan="4" className="p-3 font-bold uppercase">
                  {category}
                </td>
              </tr>

              {items.map((item) => (
                <tr key={item._globalIndex} className="border-b hover:bg-white">
                  <td className="p-4 align-top">
                    <div className="flex gap-4 items-start">
                      {item.image ? (
                        <Image
                          width={80}
                          height={80}
                          src={`${IMG_URL}/${
                            Array.isArray(item.image) ? item.image[0] : item.image
                          }`}
                          alt={item.title || "Cart item"}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md border">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.title}</p>

                        <ul className="text-sm text-gray-600 list-disc ml-5 mt-2 space-y-1">
                          {item.side && <li>Side: {item.side}</li>}
                          {item.size && <li>Size: {item.size}</li>}
                          {item.hook && <li>Hook: {item.hook}</li>}
                          {item.text && <li>Text: {item.text}</li>}
                          {item.material && <li>Material: {item.material}</li>}
                          {item.orientation && <li>Orientation: {item.orientation}</li>}
                          {item.quality && <li>Quality: {item.quality}</li>}
                          {item.design && <li>Design: {item.design}</li>}
                          {item.fileName && <li className="break-words">Uploaded File: {item.fileName}</li>}
                          {item.feature && <li>Feature: {item.feature}</li>}
                        </ul>

                        <button
                          onClick={() => removeItem(item._globalIndex)}
                          className="text-red-500 text-sm mt-3 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 align-middle text-gray-700 font-medium">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </td>

                  <td className="p-4 align-middle">
                    <div className="flex items-center border border-gray-300 rounded w-28">
                      <button
                        onClick={() => updateQuantity(item._globalIndex, item.quantity - 1)}
                        className="bg-red-700 text-white px-2 py-1 hover:bg-red-800"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._globalIndex, parseInt(e.target.value))
                        }
                        className="w-full text-center outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item._globalIndex, item.quantity + 1)}
                        className="bg-red-700 text-white px-2 py-1 hover:bg-red-800"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-4 align-middle font-semibold text-gray-800">
                    ₹{(item.quantity * (item.price || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mt-6">
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-4 md:p-5 rounded-lg shadow-md">
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="flex justify-between mb-2 text-gray-700">
            <span>Shipping</span>
            <span>₹{shippingCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>

          {isSignedIn && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCheckOut}
                className="cursor-pointer bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 w-full md:w-auto"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}