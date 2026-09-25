import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediAppoint WA | WhatsApp Booking & CRM pour Professionnels de Santé",
  description:
    "Plateforme de prise de rendez-vous intelligente avec confirmations et rappels automatiques par WhatsApp pour cabinets médicaux, dentistes et professions libérales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
