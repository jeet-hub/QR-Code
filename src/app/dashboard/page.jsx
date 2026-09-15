
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  ExternalLink,
  Pencil,
  Trash2,
  Power,
  X,
  Plus,
  LogOut,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function QRDashboard() {
  const [qrCodes, setQrCodes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingQR, setEditingQR] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");

  // =========================================================
  // CHECK SUPER ADMIN
  // =========================================================

  const checkAdmin = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // Not logged in
      if (authError || !user) {
        window.location.href = "/login";
        return;
      }

      setAdminEmail(user.email || "");

      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      // Check role
    //   if (profile?.role !== "super_admin") {
    //     setError(
    //       "Access denied. Only the Super Admin can access this dashboard."
    //     );

    //     setQrCodes([]);
    //     return;
    //   }

      // Super Admin → fetch all QR codes
      await fetchQRCodes();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to verify your access. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH ALL QR CODES
  // =========================================================

  const fetchQRCodes = async () => {
    try {
      setError("");

      const { data, error: supabaseError } = await supabase
        .from("qr_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setQrCodes(data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load QR codes."
      );

      setQrCodes([]);
    }
  };

  // =========================================================
  // INITIAL CHECK
  // =========================================================

  useEffect(() => {
    checkAdmin();
  }, []);

  // =========================================================
  // EDIT QR
  // =========================================================

  const handleEdit = (qr) => {
    setEditingQR(qr);
    setEditUrl(qr.destination_url || "");
  };

  // =========================================================
  // UPDATE QR
  // =========================================================

  const handleUpdate = async () => {
    if (!editUrl.trim()) {
      alert("Please enter a destination URL.");
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

      setEditingQR(null);
      setEditUrl("");

      await fetchQRCodes();
    } catch (err) {
      console.error(err);

      alert(
        err.message || "Failed to update QR."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ENABLE / DISABLE
  // =========================================================

  const handleToggle = async (qr) => {
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

      await fetchQRCodes();
    } catch (err) {
      console.error(err);

      alert(
        err.message || "Failed to update QR status."
      );
    }
  };

  // =========================================================
  // DELETE QR
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this QR code?"
    );

    if (!confirmDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchQRCodes();
    } catch (err) {
      console.error(err);

      alert(
        err.message || "Failed to delete QR."
      );
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/login";
  };

  // =========================================================
  // STATS
  // =========================================================

  const totalQR = qrCodes.length;

  const activeQR = qrCodes.filter(
    (qr) => qr.is_active
  ).length;

  const disabledQR = qrCodes.filter(
    (qr) => !qr.is_active
  ).length;

  const totalScans = qrCodes.reduce(
    (total, qr) => total + (qr.scan_count || 0),
    0
  );

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Loader2
              size={30}
              className="animate-spin"
            />
          </div>

          <h1 className="text-xl font-bold">
            Verifying Admin Access
          </h1>

          <p className="mt-2 text-sm text-orange-200/50">
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // ACCESS DENIED
  // =========================================================

  if (error && qrCodes.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/40 to-zinc-950 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-2xl font-bold">
            Access Denied
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-200/60">
            {error}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/qr-generator"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 font-bold text-white transition hover:from-orange-600 hover:to-orange-700"
            >
              Go to QR Generator
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-5 py-3 font-semibold text-orange-300 transition hover:bg-orange-500/10"
            >
              Login with Another Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/40 via-zinc-950 to-black p-5 shadow-2xl shadow-black/40 sm:p-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                <ShieldCheck size={28} />
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Dashboard
                  </h1>

                  {/* <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                    SUPER ADMIN
                  </span> */}

                </div>

                <p className="text-sm text-orange-200/55">
                  Manage all Dynamic QR codes across the platform.
                </p>

                {adminEmail && (
                  <p className="mt-2 text-xs text-orange-300/40">
                    Logged in as: {adminEmail}
                  </p>
                )}

              </div>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <Link
                href="/qr-generator"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:from-orange-600 hover:to-orange-700"
              >
                <Plus size={18} />
                Create New QR
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/5 px-5 py-3 font-semibold text-orange-300 transition hover:border-orange-500/40 hover:bg-orange-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-red-300">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
              {error}
            </p>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total QR */}
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/40 to-zinc-950 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-orange-200/50">
                  Total QR Codes
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalQR}
                </p>
              </div>

              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                <QrCode size={24} />
              </div>

            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-950/25 to-zinc-950 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-green-200/50">
                  Active QR
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {activeQR}
                </p>
              </div>

              <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                <Power size={24} />
              </div>

            </div>
          </div>

          {/* Disabled */}
          <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/25 to-zinc-950 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-red-200/50">
                  Disabled QR
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {disabledQR}
                </p>
              </div>

              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <Power size={24} />
              </div>

            </div>
          </div>

          {/* Scans */}
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/25 to-zinc-950 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-blue-200/50">
                  Total Scans
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalScans}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <ExternalLink size={24} />
              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            QR TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-zinc-950 shadow-2xl shadow-black/30">

          <div className="border-b border-orange-500/15 px-5 py-5 sm:px-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  All Dynamic QR Codes
                </h2>

                <p className="mt-1 text-sm text-orange-200/50">
                  Manage QR codes created by all users.
                </p>
              </div>

              <div className="rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1 text-xs text-orange-300">
                {totalQR} QR Codes
              </div>

            </div>

          </div>

          {qrCodes.length === 0 ? (

            <div className="p-12 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                <QrCode size={30} />
              </div>

              <h3 className="text-xl font-semibold">
                No QR Codes Found
              </h3>

              <p className="mt-2 text-sm text-orange-200/50">
                There are currently no Dynamic QR codes.
              </p>

              <Link
                href="/qr-generator"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 font-bold"
              >
                <Plus size={18} />
                Create QR
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left">

                <thead className="bg-black/40">

                  <tr className="border-b border-orange-500/15">

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                      QR Name
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                      Short Code
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                      Destination
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                      Scans
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-orange-300/60">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {qrCodes.map((qr) => (

                    <tr
                      key={qr.id}
                      className="border-b border-orange-500/10 transition hover:bg-orange-500/[0.03]"
                    >

                      {/* Name */}
                      <td className="px-5 py-5">

                        <div className="font-semibold text-white">
                          {qr.name || "Untitled QR"}
                        </div>

                        <div className="mt-1 text-xs text-orange-200/35">
                          Created{" "}
                          {new Date(
                            qr.created_at
                          ).toLocaleDateString()}
                        </div>

                      </td>

                      {/* Short Code */}
                      <td className="px-5 py-5">

                        <span className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-1.5 font-mono text-sm text-orange-300">
                          {qr.short_code}
                        </span>

                      </td>

                      {/* Destination */}
                      <td className="max-w-xs px-5 py-5">

                        <a
                          href={qr.destination_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 text-sm text-orange-300 transition hover:text-orange-200 hover:underline"
                        >
                          <ExternalLink
                            size={15}
                            className="mt-0.5 shrink-0"
                          />

                          <span className="break-all">
                            {qr.destination_url}
                          </span>
                        </a>

                      </td>

                      {/* Scans */}
                      <td className="px-5 py-5">

                        <span className="font-bold text-white">
                          {qr.scan_count || 0}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">

                        {qr.is_active ? (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            Active
                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Disabled
                          </span>

                        )}

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">

                        <div className="flex flex-wrap gap-2">

                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(qr)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          {/* Toggle */}
                          <button
                            onClick={() =>
                              handleToggle(qr)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-500/20"
                          >
                            <Power size={14} />

                            {qr.is_active
                              ? "Disable"
                              : "Enable"}
                          </button>

                          {/* Open */}
                          <a
                            href={`/qr/${qr.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20"
                          >
                            <ExternalLink size={14} />
                            Open
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(qr.id)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =====================================================
            EDIT MODAL
        ====================================================== */}

        {editingQR && (

          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

            <div className="w-full max-w-lg rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/60 to-zinc-950 p-6 shadow-2xl shadow-black/50 sm:p-7">

              {/* Modal Header */}
              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-400">
                    <Pencil size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Edit Dynamic QR
                    </h2>

                    <p className="text-xs text-orange-200/40">
                      Update the destination URL
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => {
                    setEditingQR(null);
                    setEditUrl("");
                  }}
                  className="rounded-lg p-2 text-orange-200/50 transition hover:bg-orange-500/10 hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

              {/* QR Name */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-orange-200">
                  QR Name
                </label>

                <input
                  type="text"
                  value={editingQR.name || ""}
                  disabled
                  className="w-full rounded-xl border border-orange-500/15 bg-black/40 px-4 py-3 text-orange-200/50 outline-none"
                />

              </div>

              {/* Short Code */}
              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-orange-200">
                  Short Code
                </label>

                <input
                  type="text"
                  value={editingQR.short_code}
                  disabled
                  className="w-full rounded-xl border border-orange-500/15 bg-black/40 px-4 py-3 font-mono text-orange-300/60 outline-none"
                />

              </div>

              {/* Destination */}
              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-orange-200">
                  Destination URL
                </label>

                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) =>
                    setEditUrl(e.target.value)
                  }
                  className="w-full rounded-xl border border-orange-500/25 bg-black/50 px-4 py-3 text-white outline-none transition placeholder:text-orange-200/25 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                  placeholder="https://example.com"
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  onClick={() => {
                    setEditingQR(null);
                    setEditUrl("");
                  }}
                  className="flex-1 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 font-semibold text-orange-300 transition hover:bg-orange-500/10"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Pencil size={17} />
                      Update QR
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </main>
  );
}
