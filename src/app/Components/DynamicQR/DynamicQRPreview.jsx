"use client";

export default function DynamicQRPreview({ qrData }) {

  const downloadQR = () => {
    if (!qrData?.qrImage) return;

    const link = document.createElement("a");

    link.href = qrData.qrImage;

    link.download = `nerodevs-qr-${qrData.shortCode}.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // No QR created yet
  if (!qrData) {
    return (
      <div className="border rounded-2xl p-6 flex items-center justify-center min-h-[400px]">

        <div className="text-center text-gray-400">

          <div className="text-5xl mb-4">
            ▦
          </div>

          <p>
            Your QR code will appear here
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="border rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Your Dynamic QR
      </h2>

      {/* QR Image */}
      <div className="flex justify-center">
        <img
          src={qrData.qrImage}
          alt="Dynamic QR Code"
          className="w-64 h-64"
        />
      </div>

      {/* QR Name */}
      <h3 className="text-center font-semibold mt-5">
        {qrData.name}
      </h3>

      {/* Dynamic URL */}
      <div className="mt-4">

        <p className="text-sm text-gray-500 mb-1">
          Dynamic QR URL
        </p>

        <div className="bg-gray-100 rounded-lg p-3 text-sm break-all">
          {qrData.qrUrl}
        </div>

      </div>

      {/* Destination */}
      <div className="mt-4">

        <p className="text-sm text-gray-500 mb-1">
          Destination
        </p>

        <div className="bg-gray-100 rounded-lg p-3 text-sm break-all">
          {qrData.destinationUrl}
        </div>

      </div>

      {/* Download */}
      <button
        onClick={downloadQR}
        className="w-full mt-6 bg-black text-white rounded-lg px-4 py-3 hover:bg-gray-800 transition"
      >
        Download QR
      </button>

    </div>
  );
}