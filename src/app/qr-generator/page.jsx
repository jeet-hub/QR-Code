"use client";

import { useState } from "react";
import DynamicQRForm from "../Components/DynamicQR/DynamicQRForm";

export default function QRGeneratorPage() {
  const [createdQR, setCreatedQR] = useState(null);

  return (
    <main className="min-h-screen bg-black px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <DynamicQRForm onQRCreated={setCreatedQR} />

        {/* QR Result */}
        {createdQR && (
          <div className="mt-6">
            {/* Your existing QR result component can come here */}
          </div>
        )}
      </div>
    </main>
  );
}