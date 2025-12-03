"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Home, ShoppingBag, Package } from "lucide-react";

export default function OrderSuccess() {
  const [countdown, setCountdown] = useState(60);

  // Countdown for redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "/";
    }
  }, [countdown]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Thank You for Shopping With Us!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your order has been confirmed and is being processed
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            {`What's Next?`}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              {`You'll receive an order confirmation email shortly`}
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              {`We'll notify you when your order ships`}
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Expected delivery: 3-5 business days
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link 
            href="/orders" 
            className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-semibold"
          >
            <ShoppingBag className="w-5 h-5" />
            View Orders
          </Link>
        </div>

        {/* Countdown */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Redirecting to home page in{" "}
            <span className="font-mono font-bold text-blue-600">{countdown}</span> seconds
          </p>
        </div>

        {/* Confetti Effect (CSS-based) */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 opacity-0"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `confetti 2s ease-out ${Math.random() * 2}s forwards`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}