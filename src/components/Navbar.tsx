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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname === "/onboarding";
  const isBookingPage = pathname.startsWith("/dr-");

  // Public pages = landing, onboarding, booking
  const isPublicPage = !isDashboard;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Medi<span className="text-emerald-600">Appoint</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {isPublicPage ? (
            <>
              <Link
                href="/"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Accueil
              </Link>
              <Link
                href="#fonctionnalites"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#tarifs"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Tarifs
              </Link>
              <Link
                href="#temoignages"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Témoignages
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Agenda
              </Link>
              <Link
                href="/dashboard/patients"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard/patients"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="h-4 w-4" />
                Patients
              </Link>
              <Link
                href="/dashboard/services"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard/services"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                Services
              </Link>
              <Link
                href="/dashboard/qr-code"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard/qr-code"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <QrCode className="h-4 w-4" />
                QR Code
              </Link>
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard/settings"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </>
          )}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          {isPublicPage ? (
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 shadow-emerald-600/20"
            >
              Essai Gratuit
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 shadow-emerald-600/20"
            >
              <PlusCircle className="h-4 w-4" />
              Nouveau Cabinet
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
