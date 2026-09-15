import DynamicQR from "../components/DynamicQR/DynamicQR";

export default function QRGeneratorPage() {
  return (
    <main className="min-h-screen py-10 px-4">

      <div className="max-w-6xl mx-auto">

        <DynamicQR />

      </div>

    </main>
  );
}