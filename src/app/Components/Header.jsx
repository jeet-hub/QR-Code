
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="bg-orange-500 text-white shadow-lg border-b-2">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-orange-500 font-bold">QR</span>
          </div>

          <Link
            href="/"
            className="text-2xl font-bold hover:text-orange-100 transition"
          >
            QR Code Generator
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-orange-100 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-black px-4 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-orange-100 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-black px-4 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
