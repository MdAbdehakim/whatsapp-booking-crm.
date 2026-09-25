"use client";

import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import {
  QrCode,
  Printer,
  Download,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Building2,
  Phone,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";

export default function ClinicQRCodePage() {
  const [clinic, setClinic] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [bookingUrl, setBookingUrl] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadClinicAndGenerateQR() {
      try {
        const res = await fetch("/api/clinics/dr-amine-bennani");
        const data = await res.json();
        if (data) {
          setClinic(data);
          const fullUrl = `${window.location.origin}/${data.slug}`;
          setBookingUrl(fullUrl);

          // Generate high-resolution QR code
          const qr = await QRCode.toDataURL(fullUrl, {
            width: 600,
            margin: 2,
            color: {
              dark: "#064e3b", // Deep emerald
              light: "#ffffff",
            },
          });
          setQrDataUrl(qr);
        }
      } catch (err) {
        console.error("Error generating QR:", err);
      }
    }
    loadClinicAndGenerateQR();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode-${clinic?.slug || "cabinet"}.png`;
    a.click();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 print:p-0">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header (Hidden when printing) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Retour au Dashboard
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Affiche & QR Code du Cabinet
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Imprimez ce chevalet ou cette affiche pour votre comptoir d'accueil, salle d'attente ou vitrine.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownloadPNG}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Télécharger PNG
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
              >
                <Printer className="h-4 w-4" />
                Imprimer l'Affiche (A4 / A5)
              </button>
            </div>
          </div>

          {/* Printable Luxury Card / Poster Container */}
          <div className="flex justify-center">
            <div
              ref={printRef}
              className="w-full max-w-lg rounded-3xl border-2 border-emerald-600/30 bg-white p-8 sm:p-10 shadow-xl text-center space-y-6 print:border-none print:shadow-none print:max-w-full print:p-0"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Prise de Rendez-vous en Ligne 24h/24
              </div>

              {/* Clinic & Doctor Name */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {clinic?.name || "Cabinet Médical"}
                </h2>
                <p className="text-sm font-semibold text-emerald-700 mt-1">
                  {clinic?.doctorName} • {clinic?.specialty}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{clinic?.address}</p>
              </div>

              {/* QR Code Graphic */}
              <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-3xl bg-emerald-50/50 p-4 border-2 border-emerald-100 shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code Réservation"
                    className="h-full w-full rounded-2xl object-contain shadow-sm"
                  />
                ) : (
                  <div className="h-full w-full animate-pulse bg-slate-200 rounded-2xl" />
                )}
              </div>

              {/* Call to Action Text */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Scannez avec l'appareil photo de votre téléphone 📱
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Choisissez votre soin, réservez votre créneau en 2 minutes et recevez votre rappel automatique par <strong>WhatsApp</strong>.
                </p>
              </div>

              {/* Footer WhatsApp Banner */}
              <div className="rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  Confirmation WhatsApp Immédiate
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {clinic?.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
