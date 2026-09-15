import Link from "next/link";
import {
  QrCode,
  FileText,
  Image,
  Type,
  ArrowRight,
  Zap,
  ShieldCheck,
  Sparkles,
  Cpu,
} from "lucide-react";

const tools = [
  {
    title: "QR Code Generator",
    description:
      "Create free QR codes for websites, text, Wi-Fi, email and more.",
    icon: QrCode,
    href: "/qr-generator",
    category: "QR Tools",
  },
  {
    title: "PDF Generator",
    description:
      "Create and generate professional PDF documents easily.",
    icon: FileText,
    href: "/pdf-generator",
    category: "PDF Tools",
  },
  {
    title: "Image Tools",
    description:
      "Resize, compress and convert your images quickly.",
    icon: Image,
    href: "/image-tools",
    category: "Image Tools",
  },
  {
    title: "Text Tools",
    description:
      "Useful text utilities for everyday work.",
    icon: Type,
    href: "/text-tools",
    category: "Text Tools",
  },
];

export default function Hero() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* AI-Powered Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-black via-orange-900 to-black px-6 py-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-orange-500 blur-3xl"></div>
          <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-orange-600 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-3 rounded-xl border border-orange-500/30 bg-linear-to-r from-orange-950 to-orange-900 px-4 py-3">
            <Cpu size={18} className="text-orange-400" />
            <span className="text-sm font-semibold text-orange-300">
              ✨ AI-Powered Tools • Intelligent Solutions • Powered by Advanced Technology
            </span>
            <Zap size={18} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">

          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/40 px-4 py-2 text-sm shadow-sm">
            <Sparkles size={16} className="text-orange-400" />
            <span className="text-orange-300">Free Online Tools</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Simple Tools.
            <br />
            <span className="bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Powerful Results.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-orange-200/80">
            Free online tools for QR codes, PDFs, images,
            text and everyday digital tasks. Powered by cutting-edge technology.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/qr-generator"
              className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3.5 font-medium text-white hover:from-orange-600 hover:to-orange-700 transition shadow-lg hover:shadow-orange-500/50"
            >
              Create QR Code
              <ArrowRight size={18} />
            </Link>

            <a
              href="#tools"
              className="rounded-xl border border-orange-500/50 bg-orange-950/30 px-6 py-3.5 font-medium text-orange-300 hover:bg-orange-950/60 hover:border-orange-400 transition"
            >
              Explore Tools
            </a>
          </div>

        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-orange-500/20 bg-linear-to-r from-orange-950/30 to-black px-6 py-10">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">

          <div className="flex items-start gap-4">
            <Zap className="mt-1 text-orange-400" size={24} />
            <div>
              <h3 className="font-semibold text-white">Fast</h3>
              <p className="mt-1 text-sm text-orange-200/60">
                Tools designed to work quickly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 text-orange-400" size={24} />
            <div>
              <h3 className="font-semibold text-white">Simple & Secure</h3>
              <p className="mt-1 text-sm text-orange-200/60">
                No unnecessary complexity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Sparkles className="mt-1 text-orange-400" size={24} />
            <div>
              <h3 className="font-semibold text-white">Free Tools</h3>
              <p className="mt-1 text-sm text-orange-200/60">
                Useful tools available for everyone.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12">
            <p className="text-sm font-semibold text-orange-400">
              OUR TOOLS
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl text-white">
              Everything you need
            </h2>

            <p className="mt-3 max-w-2xl text-orange-200/70">
              A growing collection of simple and useful online tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group rounded-2xl border border-orange-500/30 bg-linear-to-br from-orange-950/40 to-black p-6 transition hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-950/60 text-orange-400">
                    <Icon size={24} />
                  </div>

                  <p className="mt-6 text-xs font-medium text-orange-400">
                    {tool.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-orange-200/60">
                    {tool.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-orange-400">
                    Open Tool
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>

                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-orange-500/20 bg-linear-to-r from-orange-950/30 to-black px-6 py-24"
      >
        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-3xl font-bold text-white">
            Built by NeroDevs
          </h2>

          <p className="mt-5 leading-8 text-orange-200/70">
            NeroDevs Tools is a collection of simple online utilities
            designed to make everyday digital tasks easier. Powered by AI and modern web technology.
          </p>

        </div>
      </section>

    </main>
  );
}