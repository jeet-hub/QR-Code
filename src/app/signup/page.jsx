"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        throw signupError;
      }

      setMessage(
        "Account created successfully. Please check your email to verify your account."
      );

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
            <UserPlus size={28} />
          </div>

          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-orange-200/60">
            Create an account to manage your Dynamic QR codes.
          </p>

        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/45 to-zinc-950 p-6 shadow-2xl sm:p-8">

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Email */}
            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-200">
                <Mail size={16} />
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-orange-500/30
                  bg-black/50
                  px-4
                  py-3
                  text-white
                  outline-none
                  placeholder:text-orange-200/30
                  focus:border-orange-400
                  focus:ring-2
                  focus:ring-orange-500/20
                "
              />

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-200">
                <Lock size={16} />
                Password
              </label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-orange-500/30
                  bg-black/50
                  px-4
                  py-3
                  text-white
                  outline-none
                  placeholder:text-orange-200/30
                  focus:border-orange-400
                  focus:ring-2
                  focus:ring-orange-500/20
                "
              />

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                {message}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-orange-500
                to-orange-600
                py-3.5
                font-bold
                text-white
                shadow-lg
                shadow-orange-600/20
                transition
                hover:from-orange-600
                hover:to-orange-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>

          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-orange-200/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-400 hover:text-orange-300"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}