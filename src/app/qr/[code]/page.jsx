import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function QRRedirectPage({ params }) {
  const { code } = await params;

  const { data, error } = await supabase
    .from("qr_codes")
    .select("destination_url, is_active, scan_count")
    .eq("short_code", code)
    .single();

  // QR does not exist
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            QR Code Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            This QR code does not exist.
          </p>
        </div>
      </div>
    );
  }

  // QR is disabled
  if (!data.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            QR Code Disabled
          </h1>

          <p className="mt-2 text-gray-500">
            This QR code is currently inactive.
          </p>
        </div>
      </div>
    );
  }

  // Increase scan count
  await supabase
    .from("qr_codes")
    .update({
      scan_count: (data.scan_count || 0) + 1,
    })
    .eq("short_code", code);

  // Redirect to destination
  redirect(data.destination_url);
}