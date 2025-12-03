"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PHP_URL } from "@/libs/config";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${PHP_URL}/login.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      if (data.message && data.message.includes("Login successful")) {
        localStorage.setItem("isSignedIn", "true");
        localStorage.setItem("userId", data.user.id);

        alert("✅ Login successful!");
        router.push("/");
      } else {
        alert("❌ Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-screen bg-gray-50 px-4">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300
                   rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md hover:text-white transition-all text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7m-2 2v7a2 2 0 01-2 2h-3m-4 0a2 2 0 01-2-2v-7m0 0L5 10"
          />
        </svg>
        Home
      </Link>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Sign In to Identity
        </h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition-all"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          {`Don't have an account?"`}{" "}
          <Link href="/signup" className="cursor-pointer text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}