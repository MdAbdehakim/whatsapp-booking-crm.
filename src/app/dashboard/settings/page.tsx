"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Settings,
  Clock,
  MessageSquare,
  Building2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react";
import Link from "next/link";

export default function ClinicSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Clinic fields
  const [clinic, setClinic] = useState<any>(null);
  const [name, setName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/clinics/dr-amine-bennani");
      const data = await res.json();
      if (data) {
        setClinic(data);
        setName(data.name || "");
        setDoctorName(data.doctorName || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setGoogleMapsUrl(data.googleMapsUrl || "");
        setWelcomeMessage(data.welcomeMessage || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour au Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Paramètres du Cabinet & Automatisations
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gérez les informations publiques, les créneaux et les templates WhatsApp.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-2 text-xs">Chargement des paramètres...</p>
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Card 1: Coordonnées Générales */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  Profil & Coordonnées du Cabinet
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du Cabinet</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du Praticien</label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Numéro WhatsApp Officiel
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Lien Google Maps
                  </label>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 2: WhatsApp Messages Template */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  Messages WhatsApp Automatisés
                </h2>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Message d'accueil sur la page de réservation
                  </label>
                  <textarea
                    rows={2}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-emerald-900">
                    🟢 Automatisations actives par défaut :
                  </p>
                  <p>• <strong>Confirmation instantanée :</strong> Envoyée dès la réservation avec date, heure et géolocalisation.</p>
                  <p>• <strong>Rappel T-24h :</strong> Envoyé 24 heures avant le rendez-vous avec boutons de confirmation rapide (OUI / ANNULER).</p>
                  <p>• <strong>Rappel T-2h :</strong> Envoyé 2 heures avant pour rappeler l'adresse exacte au patient.</p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3">
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Paramètres enregistrés avec succès !
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
