"use client";

import { useState } from "react";
import DynamicQRForm from "./DynamicQRForm";
import DynamicQRPreview from "./DynamicQRPreview";
import DynamicQRList from "./DynamicQRList";

export default function DynamicQR() {
  const [qrData, setQrData] = useState(null);

  return (
    <div className="space-y-6">

      {/* Create + Preview */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <DynamicQRForm onQRCreated={setQrData} />

        <DynamicQRPreview qrData={qrData} />
      </section>

      {/* QR List */}
      <DynamicQRList refreshKey={qrData?.shortCode} />

    </div>
  );
}