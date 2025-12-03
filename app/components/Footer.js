import Link from "next/link";
import { FileText, ShieldCheck, RefreshCw, Phone } from "lucide-react";

export default function Footer({copyright}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-700 py-10 text-center text-sm text-white">
      {/* Links */}
      <div
        className="
          flex flex-wrap justify-center gap-8 mb-6 
          max-sm:gap-4 max-sm:flex-col max-sm:items-center
        "
      >
        <Link
          href="/termsofService"
          className="font-medium flex items-center gap-2 hover:text-blue-200 transition max-sm:text-base"
        >
          <FileText size={18} />
          Terms of Service
        </Link>

        <Link
          href="/privacy&policy"
          className="font-medium flex items-center gap-2 hover:text-blue-200 transition max-sm:text-base"
        >
          <ShieldCheck size={18} />
          Privacy & Policy
        </Link>

        <Link
          href="/cancellationRefundPolicy"
          className="font-medium flex items-center gap-2 hover:text-blue-200 transition max-sm:text-base"
        >
          <RefreshCw size={18} />
          Cancellation & Refund
        </Link>

        <Link
          href="/contact"
          className="font-medium flex items-center gap-2 hover:text-blue-200 transition max-sm:text-base"
        >
          <Phone size={18} />
          Contact
        </Link>
      </div>

      {/* Divider */}
      <div className="w-full max-w-xs mx-auto mb-4 border-t border-white/40"></div>

      {/* Copyright */}
      <p className="tracking-wide text-white/90 max-sm:text-base">
        © {currentYear} <span className="font-semibold">{copyright}</span>. All rights reserved.
      </p>
    </footer>
  );
}