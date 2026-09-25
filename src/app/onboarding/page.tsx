"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Sparkles,
  Building2,
  Stethoscope,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface ServiceItem {
  name: string;
  durationMin: number;
  price: string;
  description: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdClinic, setCreatedClinic] = useState<any>(null);

  // Form State
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("Chirurgien-Dentiste");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Services State
  const [services, setServices] = useState<ServiceItem[]>([
    {
      name: "Consultation & Bilan Général",
      durationMin: 30,
      price: "300",
      description: "Examen clinique complet et diagnostic.",
    },
    {
      name: "Détartrage & Nettoyage",
      durationMin: 45,
      price: "400",
      description: "Nettoyage en profondeur et polissage.",
    },
  ]);

  // Working Hours State
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // Mon-Sat

  const specialtiesList = [
    "Chirurgien-Dentiste",
    "Médecin Généraliste",
    "Ophtalmologue",
    "Pédiatre",
    "Gynécologue",
    "Dermatologue & Esthétique",
    "Kinésithérapeute",
    "Cabinet d'Avocats / Conseil",
  ];

  const handleAddService = () => {
    setServices([
      ...services,
      {
        name: "",
        durationMin: 30,
        price: "300",
        description: "",
      },
    ]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const toggleDay = (dayIndex: number) => {
    if (workingDays.includes(dayIndex)) {
      setWorkingDays(workingDays.filter((d) => d !== dayIndex));
    } else {
      setWorkingDays([...workingDays, dayIndex].sort());
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clinicName,
          doctorName,
          specialty,
          phone,
          email,
          city,
          address,
          googleMapsUrl,
          welcomeMessage,
          services: services.map((s) => ({
            name: s.name,
            durationMin: Number(s.durationMin) || 30,
            price: s.price ? Number(s.price) : null,
            description: s.description,
          })),
          workingDays,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de l'enregistrement.");
      }

      setCreatedClinic(data.clinic);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const daysLabels = [
    { id: 1, label: "Lun" },
    { id: 2, label: "Mar" },
    { id: 3, label: "Mer" },
    { id: 4, label: "Jeu" },
    { id: 5, label: "Ven" },
    { id: 6, label: "Sam" },
    { id: 0, label: "Dim" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Configuration Express en 2 minutes
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Créer la Page de Réservation de votre Cabinet
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Personnalisez vos services, vos horaires et activez les confirmations WhatsApp automatiques.
            </p>
          </div>

          {/* Stepper Progress */}
          {step < 4 && (
            <div className="mt-8 grid grid-cols-3 gap-2 border-b border-slate-200 pb-6 text-center text-xs font-bold">
              <div
                className={`flex items-center justify-center gap-1.5 pb-1 border-b-2 transition ${
                  step >= 1 ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400"
                }`}
              >
                <span>1. Cabinet & Médecin</span>
              </div>
              <div
                className={`flex items-center justify-center gap-1.5 pb-1 border-b-2 transition ${
                  step >= 2 ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400"
                }`}
              >
                <span>2. Services & Tarifs</span>
              </div>
              <div
                className={`flex items-center justify-center gap-1.5 pb-1 border-b-2 transition ${
                  step >= 3 ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400"
                }`}
              >
                <span>3. Horaires & Lancement</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* STEP 1: CLINIC & DOCTOR DETAILS */}
          {step === 1 && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                Informations du Praticien & Cabinet
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du Cabinet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cabinet Dentaire Dr. Sarah Alami"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du Médecin / Praticien <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Sarah Alami"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Spécialité Médicale <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    {specialtiesList.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Numéro WhatsApp du Cabinet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 06 61 99 88 77"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Adresse Complète <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 14 Bd Zerktouni, 2ème étage N°5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">
                  Lien Google Maps (Optionnel - sera envoyé dans le WhatsApp du patient)
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!clinicName || !doctorName || !phone || !address}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  Continuer vers les services
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SERVICES & PRICING */}
          {step === 2 && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-emerald-600" />
                  Services & Tarifs (Soins proposés)
                </h2>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter un soin
                </button>
              </div>

              <div className="space-y-3">
                {services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 relative text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">Soin #{idx + 1}</span>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Intitulé du soin (ex: Blanchiment laser)"
                          value={srv.name}
                          onChange={(e) => handleServiceChange(idx, "name", e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Prix en DH (ex: 300)"
                          value={srv.price}
                          onChange={(e) => handleServiceChange(idx, "price", e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-white font-bold text-emerald-800 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2">
                      <div>
                        <select
                          value={srv.durationMin}
                          onChange={(e) =>
                            handleServiceChange(idx, "durationMin", Number(e.target.value))
                          }
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={20}>20 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                          <option value={90}>90 minutes</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Description rapide..."
                          value={srv.description}
                          onChange={(e) => handleServiceChange(idx, "description", e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-white focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Précédent
                </button>
                <button
                  type="button"
                  disabled={services.some((s) => !s.name)}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  Continuer vers les horaires
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WORKING HOURS & FINAL LAUNCH */}
          {step === 3 && (
            <form
              onSubmit={handleFinalSubmit}
              className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5"
            >
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                Jours & Heures d'Ouverture
              </h2>

              {/* Working Days Badges */}
              <div>
                <label className="block font-bold text-slate-700 mb-2 text-xs">
                  Jours d'ouverture du cabinet :
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysLabels.map((d) => {
                    const isActive = workingDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Open & Close Times */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heure d'ouverture</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heure de fermeture</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 text-xs text-slate-800 space-y-1">
                <p className="font-bold text-emerald-900">
                  ⚡ Récapitulatif de votre intégration :
                </p>
                <p>• <strong>Cabinet :</strong> {clinicName} ({doctorName})</p>
                <p>• <strong>WhatsApp :</strong> {phone}</p>
                <p>• <strong>Services configurés :</strong> {services.length} prestations</p>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Précédent
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Générer ma Page de Réservation
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS REVEAL */}
          {step === 4 && createdClinic && (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Félicitations ! Votre page est en ligne 🎉
                </h2>
                <p className="mt-2 text-xs text-slate-600">
                  Votre cabinet est prêt à recevoir des rendez-vous avec confirmations et rappels automatiques par WhatsApp.
                </p>
              </div>

              {/* Unique Booking Link Card */}
              <div className="max-w-md mx-auto rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Votre lien public à partager aux patients :
                </span>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white p-3 border border-emerald-300 font-mono text-xs font-bold text-emerald-800">
                  <span className="truncate">
                    {typeof window !== "undefined" ? window.location.origin : ""}/{createdClinic.slug}
                  </span>
                  <Link
                    href={`/${createdClinic.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                  >
                    Ouvrir <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href={`/${createdClinic.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tester la Page Patient ({createdClinic.slug})
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Accéder à la Dashboard CRM
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
