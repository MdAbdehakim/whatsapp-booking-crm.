"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Calendar,
  LayoutDashboard,
  Stethoscope,
  Settings,
  PlusCircle,
  Users,
  QrCode,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isBookingPage = pathname.startsWith("/dr-");
  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname === "/onboarding";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Medi<span className="text-emerald-600">Appoint</span>
              <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                WA CRM
              </span>
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              WhatsApp Booking Engine
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            Accueil
          </Link>

          <Link
            href="/dr-amine-bennani"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              isBookingPage
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            Page Patient
            <span className="rounded bg-emerald-600/10 px-1 py-0.5 text-[9px] font-bold text-emerald-700">
              Live
            </span>
          </Link>

          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/dashboard"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Agenda CRM
          </Link>

          <Link
            href="/dashboard/patients"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/dashboard/patients"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Fiches Patients
          </Link>

          <Link
            href="/dashboard/services"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/dashboard/services"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Services
          </Link>

          <Link
            href="/dashboard/qr-code"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/dashboard/qr-code"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            Affiche QR
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Paramètres
          </Link>
        </nav>

        {/* Action Button: Create New Clinic */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/onboarding"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${
              isOnboarding
                ? "bg-emerald-700 text-white"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Créer un Cabinet
          </Link>
        </div>
      </div>
    </header>
  );
}
