import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function QRRedirectPage({ params }) {
  const { code } = await params;

  const { data, error } = await supabase.rpc(
    "get_qr_destination",
    {
      p_short_code: code,
    }
  );

  if (error) {
    console.error("QR redirect error:", error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-2 text-gray-500">
            Unable to process this QR code.
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            QR Code Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            This QR code does not exist or is disabled.
          </p>
        </div>
      </div>
    );
  }

  redirect(data[0].destination_url);
}