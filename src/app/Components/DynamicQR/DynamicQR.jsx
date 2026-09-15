"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import DynamicQRForm from "./DynamicQRForm";
import DynamicQRPreview from "./DynamicQRPreview";
import DynamicQRList from "./DynamicQRList";

export default function DynamicQR() {
  const [qrData, setQrData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="space-y-6">

      {/* Create */}
      <DynamicQRForm onQRCreated={setQrData} />

      {/* Only Logged-in Users */}
      {!loading && user && (
        <>
          {/* Preview */}
          <section>
            <DynamicQRPreview qrData={qrData} />
          </section>

          {/* QR List */}
          <DynamicQRList refreshKey={qrData?.shortCode} />
        </>
      )}

    </div>
  );
}