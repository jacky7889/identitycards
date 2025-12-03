"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {READ_URL,IMG_URL, CREATE_URL } from "@/libs/config";


export default function CheckoutCart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [shippingPrice, setShippingPrice] = useState();
  const [loading, setLoading] = useState(true);

  const [customerEmail, setCustomerEmail] = useState("");

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    contact: "",
  });

  const [billing, setBilling] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    contact: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const res = await fetch(`${READ_URL}/users.php?id=${userId}`);
        const data = await res.json();

        const user = data.user;
        console.log(user);

        setUserData(user || null);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const loggedIn = localStorage.getItem("userId");
    if (loggedIn) {
      setUser(loggedIn);
      fetchUserData(loggedIn);
    }

    const shippingCost = localStorage.getItem("shippingCost");
    setShippingPrice(shippingCost);
    
    try {
      const stored = localStorage.getItem("cartItems");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-populate shipping details when user data is loaded
  useEffect(() => {
    if (userData) {
      setShipping(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        contact: userData.contact || ""
      }));
      setCustomerEmail(userData.email || "");
    }
  }, [userData]);

  // Group items by category
  const grouped = cartItems.reduce((acc, item, index) => {
    const category = item.category || "uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...item, _globalIndex: index });
    return acc;
  }, {});

  // Calculate totals
  const subtotal = cartItems
    .reduce((sum, item) => sum + item.quantity * item.price, 0)
    .toFixed(2);

  const shippingCost = Number(shippingPrice).toFixed(2);
  const tax = (Number(subtotal) * 0.18).toFixed(2);
  const total = (
    Number(subtotal) +
    Number(shippingCost) +
    Number(tax)
  ).toFixed(2);

  // Validation functions
  const isShippingValid = () => {
    return (
      shipping.name.trim() &&
      shipping.email.trim() &&
      shipping.address.trim() &&
      shipping.city.trim() &&
      shipping.pincode.trim() &&
      shipping.contact.trim()
    );
  };

  const isBillingValid = () => {
    if (sameAsShipping) return true;
    return (
      billing.name.trim() &&
      billing.email.trim() &&
      billing.address.trim() &&
      billing.city.trim() &&
      billing.pincode.trim() &&
      billing.contact.trim()
    );
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("⚠️ Your cart is empty!");
      return;
    }

    if (!isShippingValid()) {
      alert("⚠️ Please fill all required shipping details!");
      return;
    }

    if (!isBillingValid()) {
      alert("⚠️ Please fill all required billing details!");
      return;
    }

    const user_id = user;
    const customer = { email: customerEmail };
    const shippingData = { ...shipping };
    const billingData = sameAsShipping ? { ...shipping } : { ...billing };

    try {
      const res = await fetch(`${CREATE_URL}/add_orders.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          cartItems,
          customer,
          shipping: shippingData,
          billing: billingData,
          subtotal,
          shippingCost,
          tax,
          total
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Order placed successfully!");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingCost");
        localStorage.removeItem("totalPrice");
        localStorage.removeItem("totalWeight");
        router.push("/order-success");
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error connecting to server");
    }
  };

  const goToNext = () => {
    if (activeTab === 1 && !customerEmail) {
      alert("⚠️ Please enter your email!");
      return;
    }
    if (activeTab === 2 && !isShippingValid()) {
      alert("⚠️ Please fill all required shipping details!");
      return;
    }
    if (activeTab === 3 && !isBillingValid()) {
      alert("⚠️ Please fill all required billing details!");
      return;
    }
    setActiveTab((prev) => Math.min(prev + 1, 4));
  };

  const goToPrev = () => setActiveTab((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sameAsShipping) setBilling({ ...shipping });
  }, [sameAsShipping, shipping]);

  const tabs = [
    { id: 1, label: "Customer" },
    { id: 2, label: "Shipping" },
    { id: 3, label: "Billing" },
    { id: 4, label: "Payment" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10 text-gray-800">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        {/* --- TABS --- */}
        <div className="flex justify-between mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id <= activeTab) setActiveTab(tab.id);
              }}
              className={`w-full text-center py-3 font-semibold border-b-4 transition-colors duration-300 ${
                activeTab === tab.id
                  ? "border-red-600 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENTS --- */}
        {/* 1️⃣ Customer */}
        {activeTab === 1 && (
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-semibold mb-3">Customer Information</h2>
            {userData && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  ✅ Logged in as: {userData.name} ({userData.email})
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="border rounded-md px-3 py-2 w-full sm:w-2/3"
                required
              />
              <button
                onClick={goToNext}
                disabled={!customerEmail}
                className={`px-6 py-2 rounded-md text-white font-semibold ${
                  customerEmail
                    ? "bg-red-700 hover:bg-red-800 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm mt-3">
              <input type="checkbox" className="w-4 h-4" />
              Subscribe to our newsletter
            </label>
            <p className="text-sm mt-2 text-gray-600">
              Already have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Sign in now
              </a>
            </p>
          </section>
        )}

        {/* 2️⃣ Shipping */}
        {activeTab === 2 && (
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-semibold mb-3">Shipping Details</h2>
            <p className="text-sm text-gray-600 mb-4">Fields marked with * are required</p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shipping.name}
                  onChange={(e) =>
                    setShipping({ ...shipping, name: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full"
                  required
                  readOnly={!!userData}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={shipping.email}
                  onChange={(e) =>
                    setShipping({ ...shipping, email: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full"
                  required
                  readOnly={!!userData}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  placeholder="Address"
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping({ ...shipping, address: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full"
                  required
                />
              </div>

              {/* City - Block Level Element */}
              <div className="block w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full text-black bg-white block"
                  required
                />
              </div>

              {/* Pincode - Block Level Element */}
              <div className="block w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code *
                </label>
                <input
                  type="text"
                  placeholder="Pin Code"
                  value={shipping.pincode}
                  onChange={(e) =>
                    setShipping({ ...shipping, pincode: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full text-black bg-white block"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  placeholder="Landmark"
                  value={shipping.landmark}
                  onChange={(e) =>
                    setShipping({ ...shipping, landmark: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={shipping.contact}
                  onChange={(e) =>
                    setShipping({ ...shipping, contact: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full"
                  required
                  readOnly={!!userData}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrev}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={goToNext}
                disabled={!isShippingValid()}
                className={`px-6 py-2 rounded-md text-white font-semibold ${
                  isShippingValid()
                    ? "bg-red-700 hover:bg-red-800 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Billing
              </button>
            </div>
          </section>
        )}

        {/* 3️⃣ Billing */}
        {activeTab === 3 && (
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-semibold mb-3">Billing Details</h2>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
              />
              Same as shipping details
            </label>

            {!sameAsShipping && (
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={billing.name}
                  onChange={(e) =>
                    setBilling({ ...billing, name: e.target.value })
                  }
                  className="border rounded-md px-3 py-2"
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={billing.email}
                  onChange={(e) =>
                    setBilling({ ...billing, email: e.target.value })
                  }
                  className="border rounded-md px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={billing.address}
                  onChange={(e) =>
                    setBilling({ ...billing, address: e.target.value })
                  }
                  className="border rounded-md px-3 py-2"
                  required
                />

                {/* City - Block Level Element */}
                <div className="block w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="City *"
                    value={billing.city}
                    onChange={(e) =>
                      setBilling({ ...billing, city: e.target.value })
                    }
                    className="border rounded-md px-3 py-2 w-full text-black bg-white block"
                    required
                  />
                </div>

                {/* Pincode - Block Level Element */}
                <div className="block w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    placeholder="Pin Code *"
                    value={billing.pincode}
                    onChange={(e) =>
                      setBilling({ ...billing, pincode: e.target.value })
                    }
                    className="border rounded-md px-3 py-2 w-full text-black bg-white block"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Landmark"
                  value={billing.landmark}
                  onChange={(e) =>
                    setBilling({ ...billing, landmark: e.target.value })
                  }
                  className="border rounded-md px-3 py-2"
                />
                <input
                  type="tel"
                  placeholder="Contact Number *"
                  value={billing.contact}
                  onChange={(e) =>
                    setBilling({ ...billing, contact: e.target.value })
                  }
                  className="border rounded-md px-3 py-2"
                  required
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrev}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={goToNext}
                disabled={!isBillingValid()}
                className={`px-6 py-2 rounded-md text-white font-semibold ${
                  isBillingValid()
                    ? "bg-red-700 hover:bg-red-800 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Continue to Pay
              </button>
            </div>
          </section>
        )}

        {/* 4️⃣ Payment */}
        {activeTab === 4 && (
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-semibold mb-3">Payment</h2>
            <p className="text-gray-500 text-sm mb-4">
              Payment options coming soon.
            </p>
            <div className="flex justify-between">
              <button
                onClick={goToPrev}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={handlePlaceOrder} 
                className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 cursor-pointer"
              >
                Place Order
              </button>
            </div>
          </section>
        )}
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="lg:col-span-1 border rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="font-semibold text-lg">Order Summary</h3>
          <Link href="/cart" className="text-sm text-blue-600 hover:underline">
            Edit Cart
          </Link>
        </div>

        <div className="px-5 py-4 border-b space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">Your cart is empty.</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-3">
                <h4 className="font-bold text-gray-700 capitalize border-b pb-1 mb-2">
                  {category}
                </h4>

                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 mb-2">
                    <Image
                      width={200}
                      height={300}
                      src={`${IMG_URL}/${
                        Array.isArray(item.image) ? item.image[0] : item.image
                      }`}
                      priority
                      alt={item.title}
                      className="w-20 h-14 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                        {item.selectedDesign && <li>Design: {item.selectedDesign}</li>}
                        {item.selectedSide && <li>Side: {item.selectedSide}</li>}
                        {item.design && <li>Design: {item.design}</li>}
                        {item.size && <li>Size: {item.size}</li>}
                        {item.hook && <li>Hook: {item.hook}</li>}
                        {item.text && <li>Text: {item.text}</li>}
                        <li>Quantity: {item.quantity}</li>
                      </ul>
                    </div>
                    <span className="font-semibold text-sm">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-4 space-y-3 border-b text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shippingCost}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>
        </div>

        <div className="px-5 py-5 font-bold text-lg flex justify-between">
          <span>Total (₹)</span>
          <span className="text-2xl">₹{total}</span>
        </div>
      </div>
    </div>
  );
}