'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import DynamicQR from './DynamicQR/DynamicQR';
import { Check, Copy, Download, FileDown, FileText, Image as ImageIcon, Link as LinkIcon, Mail, Palette, QrCode, RefreshCw, Sparkles, Type, Wifi } from 'lucide-react';

const features = [
  { id: 'static-qr', name: 'Static QR Code', icon: QrCode },
  { id: 'dynamic-qr', name: 'Dynamic QR Code', icon: Sparkles },
  { id: 'pdf', name: 'PDF to QR', icon: FileText },
  { id: 'image', name: 'Image Formats', icon: ImageIcon },
];

const contentTypes = [
  { id: 'link', name: 'Link', icon: LinkIcon },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'email', name: 'E-mail', icon: Mail },
  { id: 'wifi', name: 'Wi-Fi', icon: Wifi },
];

function downloadFile(href, name) {
  const link = document.createElement('a');
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function makePdfFromJpeg(jpegDataUrl, imageSize) {
  const binary = window.atob(jpegDataUrl.split(',')[1]);
  const imageBytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let length = 0;
  const add = (value) => {
    const bytes = typeof value === 'string' ? encoder.encode(value) : value;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (number, body) => {
    offsets[number] = length;
    add(`${number} 0 obj\n${body}\nendobj\n`);
  };
  const page = 612;
  const display = 360;
  const offset = (page - display) / 2;
  add('%PDF-1.4\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 612] /Resources << /XObject << /QR 4 0 R >> >> /Contents 5 0 R >>');
  offsets[4] = length;
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageSize} /Height ${imageSize} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
  add(imageBytes);
  add('\nendstream\nendobj\n');
  const stream = `q\n${display} 0 0 ${display} ${offset} ${offset} cm\n/QR Do\nQ`;
  object(5, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  const xref = length;
  add('xref\n0 6\n0000000000 65535 f \n');
  for (let number = 1; number <= 5; number += 1) add(`${String(offsets[number]).padStart(10, '0')} 00000 n \n`);
  add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
}

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState('static-qr');
  const [contentType, setContentType] = useState('link');
  const [inputValue, setInputValue] = useState('https://example.com');
  const [qrCode, setQrCode] = useState('');
  const [background, setBackground] = useState('#FFFFFF');
  const [foreground, setForeground] = useState('#111111');
  const [size, setSize] = useState('400');
  const [correction, setCorrection] = useState('H');
  const [transparent, setTransparent] = useState(false);
  const [copied, setCopied] = useState(false);

  const options = (type = 'image/png') => ({
    errorCorrectionLevel: correction,
    type,
    margin: 2,
    width: Number(size),
    color: { dark: foreground, light: transparent ? '#00000000' : background },
  });

  const generateQR = async () => {
    if (!inputValue.trim()) return setQrCode('');
    try {
      setQrCode(await QRCode.toDataURL(inputValue, options()));
    } catch (error) {
      console.error('Unable to generate QR code:', error);
    }
  };

  // This derives the async QR image whenever visual settings change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateQR();
    // The preview should refresh with each visual setting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [background, foreground, size, correction, transparent]);

  const changeContentType = (type) => {
    setContentType(type);
    setInputValue({ link: 'https://example.com', text: 'Add your message here', email: 'mailto:hello@example.com', wifi: 'WIFI:T:WPA;S:Network name;P:password;;' }[type]);
  };

  const downloadPng = () => qrCode && downloadFile(qrCode, 'qr-code.png');
  const downloadSvg = async () => {
    if (!inputValue.trim()) return;
    const svg = await QRCode.toString(inputValue, options('svg'));
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    downloadFile(url, 'qr-code.svg');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const downloadPdf = () => {
    if (!qrCode) return;
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(size);
      canvas.height = Number(size);
      const context = canvas.getContext('2d');
      context.fillStyle = transparent ? '#FFFFFF' : background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const url = URL.createObjectURL(makePdfFromJpeg(canvas.toDataURL('image/jpeg', 0.98), Number(size)));
      downloadFile(url, 'qr-code.pdf');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    image.src = qrCode;
  };
  const copyContent = async () => {
    await navigator.clipboard.writeText(inputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-orange-400">Free online tool</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">QR Code Generator</h1>
          <p className="mt-3 text-lg text-orange-300">Create QR codes instantly from text, URLs, and more</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {features.map(({ id, name, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-semibold transition ${activeTab === id ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-slate-800 text-orange-300 hover:bg-slate-700'}`}><Icon size={21} /> {name}</button>)}
        </div>

        {activeTab === 'static-qr' ? <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/45 to-zinc-950 p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="mb-7 flex items-center gap-3"><span className="rounded-xl bg-orange-500/15 p-2 text-orange-400"><QrCode size={23} /></span><div><h2 className="text-xl font-bold">Create your QR code</h2><p className="text-sm text-orange-200/65">Choose content, customize its style, then export.</p></div></div>
            <div className="grid grid-cols-2 gap-2 border-b border-orange-500/20 pb-5 sm:grid-cols-4">{contentTypes.map(({ id, name, icon: Icon }) => <button key={id} onClick={() => changeContentType(id)} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${contentType === id ? 'bg-orange-500 text-white' : 'bg-black/40 text-orange-200 hover:bg-orange-500/15'}`}><Icon size={16} />{name}</button>)}</div>
            <label className="mt-6 block text-sm font-semibold text-orange-200">{contentType === 'link' ? 'Link (URL)' : contentType === 'text' ? 'Your text' : contentType === 'email' ? 'Email address' : 'Wi-Fi details'}</label>
            <textarea value={inputValue} onChange={(event) => setInputValue(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-orange-500/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-orange-400" placeholder="Enter content for your QR code" />
            <div className="mt-7 grid gap-5 border-t border-orange-500/20 pt-6 sm:grid-cols-2">
              <ColorControl label="Background QR code" value={background} onChange={setBackground} />
              <ColorControl label="QR code color" value={foreground} onChange={setForeground} />
              <SelectControl label="Size QR code" value={size} onChange={setSize} options={[['300', '300 × 300 px'], ['400', '400 × 400 px'], ['600', '600 × 600 px']]} />
              <SelectControl label="Precision QR code" value={correction} onChange={setCorrection} options={[['L', 'L — Low'], ['M', 'M — Medium'], ['Q', 'Q — Quartile'], ['H', 'H — High']]} />
            </div>
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-orange-100"><input type="checkbox" checked={transparent} onChange={(event) => setTransparent(event.target.checked)} className="h-4 w-4 accent-orange-500" /> Transparent background</label>
            <button onClick={generateQR} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 font-bold text-white transition hover:from-orange-600 hover:to-orange-700"><RefreshCw size={19} /> Generate QR Code</button>
          </div>
          <aside className="h-fit rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/45 to-zinc-950 p-5 shadow-2xl shadow-black/30 lg:sticky lg:top-6 sm:p-7">
            <h2 className="text-xl font-bold">Your QR Code</h2><p className="mt-1 text-sm text-orange-200/65">Ready to scan and download.</p>
            <div className="mt-6 flex aspect-square items-center justify-center rounded-xl bg-white p-5"><img src={qrCode} alt="Generated QR Code" className="h-full w-full object-contain" /></div>
            <div className="mt-6 grid grid-cols-3 gap-2"><ExportButton onClick={downloadPng} icon={Download} label="PNG" active /><ExportButton onClick={downloadSvg} icon={ImageIcon} label="SVG" /><ExportButton onClick={downloadPdf} icon={FileDown} label="PDF" /></div>
            <button onClick={copyContent} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-orange-500/30 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/10">{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Copied content' : 'Copy content'}</button>
            <p className="mt-5 text-center text-xs text-orange-200/55">{size} × {size} px · {correction} error correction</p>
          </aside>
        </section> : activeTab === 'dynamic-qr' ? <DynamicQR /> : <section className="rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-950/45 to-zinc-950 p-10 text-center"><Sparkles className="mx-auto text-orange-400" size={42} /><h2 className="mt-4 text-2xl font-bold">{features.find((feature) => feature.id === activeTab)?.name}</h2><p className="mt-2 text-orange-200/70">This tool area is ready for the next feature. Your QR generator remains available in Static QR Code.</p><button onClick={() => setActiveTab('static-qr')} className="mt-6 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600">Open QR Generator</button></section>}
      </div>
    </main>
  );
}

function ColorControl({ label, value, onChange }) {
  return <div><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-200"><Palette size={16} /> {label}</div><div className="flex gap-2"><input aria-label={label} type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-12 cursor-pointer rounded border border-orange-500/30 bg-transparent p-1" /><input value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-orange-500/30 bg-black/50 px-3 font-mono text-sm text-white outline-none focus:border-orange-400" /></div></div>;
}

function SelectControl({ label, value, onChange, options }) {
  return <label className="text-sm font-semibold text-orange-200">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-3 w-full rounded-lg border border-orange-500/30 bg-black/50 px-3 py-3 text-white outline-none focus:border-orange-400">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function ExportButton({ onClick, icon: Icon, label, active }) {
  return <button onClick={onClick} className={`rounded-lg px-2 py-3 text-xs font-bold transition ${active ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-orange-500/15 text-orange-200 hover:bg-orange-500/25'}`}><Icon className="mx-auto mb-1" size={16} />{label}</button>;
}



