
"use client";

import { useState } from "react";
import QRCode from "qrcode";
import {
  Link as LinkIcon,
  QrCode,
  Sparkles,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DynamicQRForm({ onQRCreated }) {
  const [name, setName] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAuthModal, setShowAuthModal] = useState(false);

  const generateCode = () => {
    return Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!destinationUrl.trim()) {
      setError("Please enter destination URL.");
      return;
    }

    try {
      setLoading(true);

      // Check login before creating QR
      const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
        setShowAuthModal(true);
        return;
}

      // User is logged in → create QR
      const code = generateCode();

      const { data, error: supabaseError } = await supabase
        .from("qr_codes")
        .insert([
          {
            user_id: user.id,
            short_code: code,
            destination_url: destinationUrl.trim(),
            name: name.trim() || "Untitled QR",
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      const qrUrl = `${window.location.origin}/qr/${data.short_code}`;

      const qrImage = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      onQRCreated({
        name: data.name,
        shortCode: data.short_code,
        destinationUrl: data.destination_url,
        qrUrl,
        qrImage,
      });

      setName("");
      setDestinationUrl("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dynamic QR Form */}
      <div className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/45 to-zinc-950 p-5 shadow-2xl shadow-black/30 sm:p-7">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-orange-500/15 p-2 text-orange-400">
              <Sparkles size={23} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-white">
                Create Dynamic QR
              </h2>

              <p className="text-sm text-orange-200/65">
                Create a QR code that you can update anytime.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* QR Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-200">
              <QrCode size={16} />
              QR Name
            </label>

            <input
              type="text"
              placeholder="My Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-orange-500/30 bg-black/50 px-4 py-3 text-white placeholder:text-orange-200/35 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Destination URL */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-200">
              <LinkIcon size={16} />
              Destination URL
            </label>

            <input
              type="url"
              placeholder="https://example.com"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="w-full rounded-xl border border-orange-500/30 bg-black/50 px-4 py-3 text-white placeholder:text-orange-200/35 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
              required
            />

            <p className="mt-2 text-xs text-orange-200/50">
              This is the website where your Dynamic QR will redirect.
            </p>
          </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating QR...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Create Dynamic QR
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Login / Signup Popup */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950 to-zinc-950 p-6 shadow-2xl shadow-orange-950/30 sm:p-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-orange-200/60 transition hover:bg-orange-500/10 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                <QrCode size={32} />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">
                Login Required
              </h3>

              <p className="mt-2 text-sm leading-6 text-orange-200/65">
                Please login or create an account before creating your
                Dynamic QR code.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 font-bold text-white transition hover:from-orange-600 hover:to-orange-700"
              >
                <LogIn size={19} />
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/signup";
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 py-3.5 font-bold text-orange-300 transition hover:bg-orange-500/20 hover:text-orange-200"
              >
                <UserPlus size={19} />
                Create Account
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-orange-200/40">
              Your QR codes will be saved to your account.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
