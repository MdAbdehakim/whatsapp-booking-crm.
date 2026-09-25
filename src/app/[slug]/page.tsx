"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageSquare,
  AlertCircle,
  Globe,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { fr, arMA } from "date-fns/locale";
import { formatFrenchDate, formatPrice } from "@/lib/utils";
import { translations, type Language } from "@/lib/i18n";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number | null;
  color: string;
}

interface Slot {
  time: string;
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

interface Clinic {
  id: string;
  name: string;
  slug: string;
  doctorName: string;
  specialty: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  googleMapsUrl: string | null;
  welcomeMessage: string | null;
  logoUrl: string | null;
  services: Service[];
}

export default function ClinicBookingPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loadingClinic, setLoadingClinic] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Language State: 'fr' | 'ar' | 'darija'
  const [lang, setLang] = useState<Language>("fr");
  const t = translations[lang];

  // Booking Flow Steps: 1: Service, 2: Date & Slot, 3: Form, 4: Confirmed
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Patient Info
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Fetch Clinic Info on mount
  useEffect(() => {
    async function loadClinic() {
      try {
        setLoadingClinic(true);
        const res = await fetch(`/api/clinics/${slug}`);
        if (!res.ok) {
          throw new Error("Cabinet introuvable ou inactif.");
        }
        const data = await res.json();
        setClinic(data);
        if (data.services?.length > 0) {
          setSelectedService(data.services[0]);
        }
      } catch (err: any) {
        setError(err.message || "Erreur de chargement.");
      } finally {
        setLoadingClinic(false);
      }
    }
    if (slug) loadClinic();
  }, [slug]);

  // Fetch Available Slots whenever selectedDate or selectedService changes
  useEffect(() => {
    async function loadSlots() {
      if (!clinic || !selectedService || !selectedDate) return;
      try {
        setLoadingSlots(true);
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(
          `/api/clinics/${clinic.slug}/slots?date=${dateStr}&serviceId=${selectedService.id}`
        );
        const data = await res.json();
        setAvailableSlots(data.slots || []);
        setSelectedSlot(null);
      } catch (err) {
        console.error("Error loading slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [clinic, selectedService, selectedDate]);

  // Handle Form Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinic || !selectedService || !selectedSlot) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: clinic.id,
          serviceId: selectedService.id,
          startTime: selectedSlot.startTime,
          fullName,
          phoneNumber,
          email,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de la réservation");
      }

      setBookingSuccess(data);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingClinic) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Chargement du cabinet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !clinic) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-red-100">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Cabinet introuvable</h2>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const upcomingDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const dateLocale = lang === "fr" ? fr : arMA;

  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50"
      dir={t.dir}
    >
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Language Selector Bar */}
          <div className="mb-4 flex justify-end">
            <div className="inline-flex items-center gap-1 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
              <Globe className="h-3.5 w-3.5 ml-2 text-slate-400" />
              <button
                onClick={() => setLang("fr")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  lang === "fr" ? "bg-emerald-600 text-white shadow-sm" : "hover:bg-slate-50"
                }`}
              >
                Français
              </button>
              <button
                onClick={() => setLang("ar")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  lang === "ar" ? "bg-emerald-600 text-white shadow-sm" : "hover:bg-slate-50"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang("darija")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  lang === "darija" ? "bg-emerald-600 text-white shadow-sm" : "hover:bg-slate-50"
                }`}
              >
                الدارجة 🇲🇦
              </button>
            </div>
          </div>

          {/* Clinic Header Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 font-bold text-white text-2xl shadow-md shadow-emerald-600/20">
                  {clinic?.doctorName?.split(" ")?.slice(-1)?.[0]?.[0] || "D"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {clinic?.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      <Sparkles className="h-3 w-3" />
                      {t.verified}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-700">{clinic?.specialty}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {clinic?.address}, {clinic?.city}
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Call Badge */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t.contactDirect}
                </span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {clinic?.phone}
                </span>
              </div>
            </div>

            {clinic?.welcomeMessage && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100">
                💡 {clinic.welcomeMessage}
              </div>
            )}
          </div>

          {/* Stepper Navigation */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 sm:gap-6">
                <button
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition ${
                    step >= 1 ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">
                    1
                  </span>
                  {t.step1}
                </button>
                <span className="text-slate-300">/</span>
                <button
                  onClick={() => selectedService && setStep(2)}
                  disabled={!selectedService}
                  className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition ${
                    step >= 2 ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">
                    2
                  </span>
                  {t.step2}
                </button>
                <span className="text-slate-300">/</span>
                <button
                  onClick={() => selectedSlot && setStep(3)}
                  disabled={!selectedSlot}
                  className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition ${
                    step >= 3 ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">
                    3
                  </span>
                  {t.step3}
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {t.selectServiceTitle}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {clinic?.services?.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/40 shadow-md shadow-emerald-600/10"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900 text-base">{service.name}</h3>
                        <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                      {service.description && (
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {t.avgDuration} : {service.durationMin} min
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedService}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {t.continueDate}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE & TIME SLOT */}
          {step === 2 && (
            <div className="mt-6 space-y-6">
              {/* Service Reminder Bar */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                <div>
                  <span className="text-xs text-emerald-700 font-semibold uppercase">{t.chosenService} :</span>
                  <p className="font-bold text-slate-900">{selectedService?.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-800">
                    {formatPrice(selectedService?.price)}
                  </span>
                  <p className="text-xs text-slate-500">{selectedService?.durationMin} min</p>
                </div>
              </div>

              {/* Date Horizontal Picker */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-emerald-600" />
                  {t.chooseDay}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {upcomingDays.map((d, index) => {
                    const isSelected = isSameDay(d, selectedDate);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(d)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-[11px] font-semibold uppercase">
                          {format(d, "EEE", { locale: dateLocale })}
                        </span>
                        <span className="text-lg font-bold mt-0.5">{format(d, "d")}</span>
                        <span className="text-[10px] opacity-80">{format(d, "MMM", { locale: dateLocale })}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots Grid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span>{t.availableSlotsFor} {formatFrenchDate(selectedDate)} :</span>
                  {loadingSlots && <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />}
                </h3>

                {availableSlots.length === 0 && !loadingSlots && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">{t.noSlots}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.clinicClosed}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {availableSlots.map((slot, idx) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                          !slot.available
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-60"
                            : isSelected
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {!slot.available && (
                          <span className="text-[9px] font-normal no-underline text-slate-400">
                            {t.occupied}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t.backToMotifs}
                </button>

                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {t.continueWith} {selectedSlot?.time || "--:--"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT CONTACT FORM */}
          {step === 3 && (
            <div className="mt-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">{t.patientInfoTitle}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {t.patientInfoSubtitle}
                </p>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmitBooking} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.fullNameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.fullNamePlaceholder}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.phoneLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t.phonePlaceholder}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">{t.phoneHint}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: youssef@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.notesLabel}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900">{t.summaryTitle}</p>
                    <p>• <strong>{t.service} :</strong> {selectedService?.name} ({formatPrice(selectedService?.price)})</p>
                    <p>• <strong>{t.dateAndTime} :</strong> {formatFrenchDate(selectedDate)} à <strong>{selectedSlot?.time}</strong></p>
                    <p>• <strong>{t.cabinet} :</strong> {clinic?.name}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      {t.changeTime}
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.confirming}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          {t.confirmBtn}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && bookingSuccess && (
            <div className="mt-6 space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                  {t.successTitle}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {t.successSubtitle} (
                  <strong className="text-emerald-700">{phoneNumber}</strong>).
                </p>

                {/* Details summary */}
                <div className="mt-6 max-w-md mx-auto rounded-2xl bg-slate-50 p-5 border border-slate-200/80 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.patient} :</span>
                    <span className="font-bold text-slate-800">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.service} :</span>
                    <span className="font-bold text-slate-800">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.dateAndTime} :</span>
                    <span className="font-bold text-emerald-700">
                      {formatFrenchDate(selectedDate)} à {selectedSlot?.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.cabinet} :</span>
                    <span className="font-bold text-slate-800">{clinic?.name}</span>
                  </div>
                </div>

                {/* Simulated WhatsApp Phone Mock */}
                <div className="mt-8 max-w-md mx-auto text-left">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-800">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    {t.waPreviewTitle}
                  </div>

                  <div className="rounded-2xl bg-[#EFEAE2] p-4 border border-[#d1d7db] shadow-inner font-sans">
                    <div className="rounded-xl bg-white p-3.5 shadow-sm text-xs text-slate-800 border-l-4 border-emerald-600 leading-relaxed space-y-2">
                      <p className="font-semibold text-emerald-800">
                        {clinic?.name}
                      </p>
                      <p className="whitespace-pre-line text-[12px] text-slate-700">
                        {bookingSuccess.whatsapp?.messageText ||
                          `👋 Bonjour ${fullName},\n\nVotre RDV chez ${clinic?.doctorName} est confirmé pour le ${formatFrenchDate(selectedDate)} à ${selectedSlot?.time}.`}
                      </p>
                      <div className="text-[10px] text-slate-400 text-right">
                        {format(new Date(), "HH:mm")} ✓✓
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedSlot(null);
                      setBookingSuccess(null);
                    }}
                    className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {t.bookAnother}
                  </button>
                  <a
                    href="/dashboard"
                    className="w-full sm:w-auto rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    {t.viewInDashboard}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
