"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PHP_URL } from "@/libs/config";

export default function SignUpA() {
  const router = useRouter();

  // Step: 1 = enter name+email+contact, 2 = verify otp, 3 = set password
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", contact: "" });
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    let tid;
    if (resendCooldown > 0) {
      tid = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(tid);
  }, [resendCooldown]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Step 1: send OTP
  const sendOtp = async (e) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.contact.trim()) {
      return alert("Enter name, email, and contact number");
    }
    
    // Validate contact number (basic validation)
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(form.contact.trim())) {
      return alert("Please enter a valid 10-digit contact number");
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${PHP_URL}/send-otp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name.trim(), 
          email: form.email.trim(),
          contact: form.contact.trim()
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your email");
        setStep(2);
        setResendCooldown(30); // 30 sec cooldown
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handling
  const onOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const copy = [...otpInputs];
    copy[idx] = val;
    setOtpInputs(copy);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const onOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpInputs[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  // Step 2: verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otpInputs.join("");
    if (otpValue.length !== 6) return alert("Enter 6-digit OTP");
    setIsLoading(true);
    try {
      const res = await fetch(`${PHP_URL}/verify-otp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email.trim(), 
          otp: otpValue 
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified — now set your password");
        setStep(3);
      } else {
        alert(data.message || "Invalid or expired OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${PHP_URL}/send-otp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name.trim(), 
          email: form.email.trim(),
          contact: form.contact.trim()
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("New OTP sent");
        setOtpInputs(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        setResendCooldown(30);
      } else {
        alert(data.message || "Failed to resend");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: create account (password)
  const createAccount = async (e) => {
    e.preventDefault();
    if (passwords.password.length < 6) return alert("Password min 6 chars");
    if (passwords.password !== passwords.confirmPassword) return alert("Passwords do not match");
    setIsLoading(true);
    try {
      const res = await fetch(`${PHP_URL}/create-account.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name.trim(), 
          email: form.email.trim(),
          contact: form.contact.trim(),
          password: passwords.password 
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Account created. Please sign in.");
        router.push("/signin");
      } else {
        alert(data.message || "Error creating account");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Sign Up
        </h1>
        {/* Step headers */}
        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <div className={step === 1 ? "font-semibold text-blue-600" : ""}>1. Details</div>
          <div className={step === 2 ? "font-semibold text-blue-600" : ""}>2. OTP</div>
          <div className={step === 3 ? "font-semibold text-blue-600" : ""}>3. Password</div>
        </div>

        {/* STEP 1 - send OTP */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="text-sm">Full Name *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleFormChange} 
                className="w-full p-3 border rounded" 
                required 
              />
            </div>
            <div>
              <label className="text-sm">Email *</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleFormChange} 
                className="w-full p-3 border rounded" 
                required 
              />
            </div>
            <div>
              <label className="text-sm">Contact Number *</label>
              <input 
                name="contact" 
                type="tel"
                value={form.contact}
                onChange={handleFormChange}
                placeholder="10-digit number"
                className="w-full p-3 border rounded"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your 10-digit contact number</p>
            </div>
            <button disabled={isLoading} className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded">
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 - verify OTP */}
        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4 text-center">
            <p className="text-sm text-gray-600">We sent a 6-digit code to <strong>{form.email}</strong></p>

            <div className="flex justify-center gap-2 mt-4">
              {otpInputs.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={v}
                  onChange={(e) => onOtpChange(e, i)}
                  onKeyDown={(e) => onOtpKeyDown(e, i)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-12 h-12 text-center text-xl border rounded"
                />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button type="submit" disabled={isLoading} className="cursor-pointer flex-1 bg-green-600 text-white py-2 rounded">
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button type="button" onClick={resendOtp} disabled={isLoading || resendCooldown > 0} className="cursor-pointer px-4 py-2 border rounded">
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
              </button>
            </div>

            <button type="button" onClick={() => setStep(1)} className="cursor-pointer w-full mt-2 text-sm text-gray-600 underline">
              Back
            </button>
          </form>
        )}

        {/* STEP 3 - create password */}
        {step === 3 && (
          <form onSubmit={createAccount} className="space-y-4">
            <div>
              <label className="text-sm">Password *</label>
              <input 
                type="password" 
                value={passwords.password} 
                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} 
                className="w-full p-3 border rounded" 
                minLength={6} 
                required 
              />
            </div>
            <div>
              <label className="text-sm">Confirm Password *</label>
              <input 
                type="password" 
                value={passwords.confirmPassword} 
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
                className="w-full p-3 border rounded" 
                minLength={6} 
                required 
              />
            </div>
            <button disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded">
              {isLoading ? "Creating..." : "Create Account"}
            </button>
            <button type="button" onClick={() => setStep(2)} className="cursor-pointer w-full mt-2 border py-2 rounded text-sm">
              Back to OTP
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-4">
          Already have an account? <Link href="/signin" className="cursor-pointer text-blue-600 cursor-pointer">Sign In</Link>
        </p>
      </div>
    </div>
  );
}