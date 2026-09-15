"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Pencil,
  QrCode,
  Trash2,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DynamicQRList({ refreshKey }) {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingQR, setEditingQR] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: supabaseError } = await supabase
        .from("qr_codes")
        .select(
          "id, short_code, destination_url, name, is_active, scan_count, created_at"
        )
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setQrCodes(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load QR codes.");
      setQrCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [refreshKey]);

  const openEdit = (qr) => {
    setEditingQR(qr);
    setEditUrl(qr.destination_url);
  };

  const closeEdit = () => {
    setEditingQR(null);
    setEditUrl("");
  };

  const updateQR = async () => {
    if (!editUrl.trim()) {
      return;
    }

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from("qr_codes")
        .update({
          destination_url: editUrl.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingQR.id);

      if (updateError) {
        throw updateError;
      }

      setQrCodes((prev) =>
        prev.map((qr) =>
          qr.id === editingQR.id
            ? {
                ...qr,
                destination_url: editUrl.trim(),
              }
            : qr
        )
      );

      closeEdit();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update QR code.");
    } finally {
      setSaving(false);
    }
  };

  const toggleQR = async (qr) => {
    try {
      const { error: updateError } = await supabase
        .from("qr_codes")
        .update({
          is_active: !qr.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", qr.id);

      if (updateError) {
        throw updateError;
      }

      setQrCodes((prev) =>
        prev.map((item) =>
          item.id === qr.id
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update QR status.");
    }
  };

  const deleteQR = async (qr) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${qr.name || "Untitled QR"}"?`
    );

    if (!confirmed) return;

    try {
      const { error: deleteError } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", qr.id);

      if (deleteError) {
        throw deleteError;
      }

      setQrCodes((prev) => prev.filter((item) => item.id !== qr.id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete QR code.");
    }
  };

  const getQRUrl = (shortCode) => {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/qr/${shortCode}`;
  };

  return (
    <>
      <section className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/45 to-zinc-950 p-5 shadow-2xl shadow-black/30 sm:p-7">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-orange-500/15 p-2 text-orange-400">
              <QrCode size={23} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-white">
                Your Dynamic QR Codes
              </h2>

              <p className="text-sm text-orange-200/65">
                Manage your created QR codes.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
            {qrCodes?.length || 0} QR
            {qrCodes?.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12 text-orange-300">
            <Loader2 size={24} className="mr-2 animate-spin" />
            Loading QR codes...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && (!qrCodes || qrCodes.length === 0) && (
          <div className="rounded-xl border border-orange-500/15 bg-black/30 py-12 text-center">
            <QrCode
              size={42}
              className="mx-auto mb-4 text-orange-500/40"
            />

            <p className="font-semibold text-white">
              No Dynamic QR codes yet
            </p>

            <p className="mt-1 text-sm text-orange-200/50">
              Create your first Dynamic QR code above.
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && qrCodes?.length > 0 && (
          <div className="hidden overflow-x-auto rounded-xl border border-orange-500/15 md:block">
            <table className="w-full min-w-[850px] text-left">

              <thead className="border-b border-orange-500/15 bg-black/40">
                <tr>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                    QR Name
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                    Code
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                    Destination
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                    Scans
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                    Status
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-orange-500/10">
                {qrCodes.map((qr) => (
                  <tr
                    key={qr.id}
                    className="transition hover:bg-orange-500/5"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">
                        {qr.name || "Untitled QR"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-orange-500/10 px-2.5 py-1 font-mono text-sm font-semibold text-orange-300">
                        {qr.short_code}
                      </span>
                    </td>

                    <td className="max-w-[260px] px-4 py-4">
                      <a
                        href={qr.destination_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-orange-200 transition hover:text-orange-400"
                      >
                        <span className="truncate">
                          {qr.destination_url}
                        </span>

                        <ExternalLink
                          size={14}
                          className="shrink-0"
                        />
                      </a>
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-white">
                      {qr.scan_count || 0}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleQR(qr)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          qr.is_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {qr.is_active ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">

                        <a
                          href={getQRUrl(qr.short_code)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-orange-500/20 p-2 text-orange-300 transition hover:bg-orange-500/10"
                          title="Open QR"
                        >
                          <ExternalLink size={16} />
                        </a>

                        <button
                          onClick={() => openEdit(qr)}
                          className="rounded-lg border border-orange-500/20 p-2 text-orange-300 transition hover:bg-orange-500/10"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => deleteQR(qr)}
                          className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && qrCodes?.length > 0 && (
          <div className="space-y-4 md:hidden">

            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="rounded-xl border border-orange-500/15 bg-black/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="font-semibold text-white">
                      {qr.name || "Untitled QR"}
                    </h3>

                    <p className="mt-1 font-mono text-sm text-orange-400">
                      {qr.short_code}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      qr.is_active
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {qr.is_active ? "Active" : "Disabled"}
                  </span>

                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-orange-300/50">
                    Destination
                  </p>

                  <p className="mt-1 break-all text-sm text-orange-200/80">
                    {qr.destination_url}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-xs uppercase tracking-wider text-orange-300/50">
                    Scans
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {qr.scan_count || 0}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">

                  <a
                    href={getQRUrl(qr.short_code)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-orange-500/20 py-2.5 text-sm font-semibold text-orange-300"
                  >
                    <ExternalLink size={16} />
                    Open
                  </a>

                  <button
                    onClick={() => openEdit(qr)}
                    className="rounded-lg border border-orange-500/20 px-4 text-orange-300"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => deleteQR(qr)}
                    className="rounded-lg border border-red-500/20 px-4 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </section>

      {/* Edit Modal */}
      {editingQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-orange-500/25 bg-zinc-950 p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-white">
                  Edit Dynamic QR
                </h3>

                <p className="mt-1 text-sm text-orange-200/60">
                  Code: {editingQR.short_code}
                </p>
              </div>

              <button
                onClick={closeEdit}
                className="rounded-lg p-2 text-orange-200/60 transition hover:bg-orange-500/10 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            <label className="mb-2 block text-sm font-semibold text-orange-200">
              Destination URL
            </label>

            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
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
                transition
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-500/20
              "
              placeholder="https://example.com"
            />

            <div className="mt-6 flex gap-3">

              <button
                onClick={closeEdit}
                className="flex-1 rounded-xl border border-orange-500/20 py-3 font-semibold text-orange-200 transition hover:bg-orange-500/10"
              >
                Cancel
              </button>

              <button
                onClick={updateQR}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-bold text-white transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}