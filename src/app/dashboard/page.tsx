"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Send,
  Sparkles,
  DollarSign,
  TrendingUp,
  MapPin,
  Loader2,
  Trash2,
  Printer,
  Download,
  Building2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { format, parseISO, isToday, isTomorrow, addDays, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { formatFrenchDate, formatFrenchTime, formatPrice } from "@/lib/utils";
import Link from "next/link";

interface ClinicItem {
  id: string;
  name: string;
  slug: string;
  doctorName: string;
  phone: string;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes: string | null;
  cancellationReason: string | null;
  patient: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string | null;
  };
  service: {
    id: string;
    name: string;
    durationMin: number;
    price: number | null;
    color: string;
  };
  clinic: {
    id: string;
    name: string;
    slug: string;
    doctorName: string;
  };
  whatsappLogs: {
    id: string;
    messageType: string;
    content: string;
    status: string;
    responseReceived: string | null;
    sentAt: string;
  }[];
}

export default function DashboardPage() {
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [selectedClinicSlug, setSelectedClinicSlug] = useState<string>("dr-amine-bennani");
  const [selectedClinic, setSelectedClinic] = useState<ClinicItem | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Appointment Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [manualForm, setManualForm] = useState({
    fullName: "",
    phoneNumber: "",
    serviceId: "",
    startTime: format(new Date(), "yyyy-MM-dd'T'10:00"),
    notes: "",
  });
  const [creatingManual, setCreatingManual] = useState(false);

  // WhatsApp Simulation Tool State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simPhone, setSimPhone] = useState("+212661889900");
  const [simMessage, setSimMessage] = useState("OUI");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load All Clinics
  async function loadClinics() {
    try {
      const res = await fetch("/api/clinics");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setClinics(data);
        const current = data.find((c) => c.slug === selectedClinicSlug) || data[0];
        setSelectedClinic(current);
        setSelectedClinicSlug(current.slug);
      }
    } catch (err) {
      console.error("Error loading clinics:", err);
    }
  }

  // Load Appointments for the selected Clinic & Date
  async function fetchAppointments() {
    try {
      setLoading(true);
      const clinicParam = selectedClinic?.id ? `&clinicId=${selectedClinic.id}` : "";
      const res = await fetch(
        `/api/appointments?date=${selectedDate}${
          filterStatus !== "ALL" ? `&status=${filterStatus}` : ""
        }${clinicParam}`
      );
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  // Load Services for Manual Booking
  async function fetchClinicServices() {
    if (!selectedClinicSlug) return;
    try {
      const res = await fetch(`/api/clinics/${selectedClinicSlug}`);
      const data = await res.json();
      if (data.services) {
        setServicesList(data.services);
        if (data.services.length > 0) {
          setManualForm((prev) => ({ ...prev, serviceId: data.services[0].id }));
        }
      }
    } catch (err) {
      console.error("Error loading services:", err);
    }
  }

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchClinicServices();
  }, [selectedDate, filterStatus, selectedClinicSlug, selectedClinic]);

  // Update Status Action
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Statut mis à jour : ${newStatus}`);
        fetchAppointments();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Trigger WhatsApp Reminder Action
  const handleSendReminder = async (appointmentId: string) => {
    try {
      const res = await fetch("/api/whatsapp/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, type: "REMINDER_24H" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✅ Rappel WhatsApp envoyé avec succès au patient !");
        fetchAppointments();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi du rappel.");
    }
  };

  // Create Manual Appointment
  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingManual(true);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: selectedClinic?.id || servicesList[0]?.clinicId,
          serviceId: manualForm.serviceId,
          startTime: manualForm.startTime,
          fullName: manualForm.fullName,
          phoneNumber: manualForm.phoneNumber,
          notes: manualForm.notes,
        }),
      });
      if (res.ok) {
        setIsNewModalOpen(false);
        showToast("🎉 Nouveau rendez-vous enregistré et confirmé par WhatsApp !");
        setManualForm({
          fullName: "",
          phoneNumber: "",
          serviceId: servicesList[0]?.id || "",
          startTime: format(new Date(), "yyyy-MM-dd'T'10:00"),
          notes: "",
        });
        fetchAppointments();
      } else {
        const d = await res.json();
        alert(d.error || "Erreur de création.");
      }
    } catch (err) {
      alert("Erreur serveur.");
    } finally {
      setCreatingManual(false);
    }
  };

  // Simulate Inbound WhatsApp Webhook
  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSimulating(true);
      const res = await fetch("/api/webhook/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulate: true,
          phoneNumber: simPhone,
          messageText: simMessage,
        }),
      });
      const data = await res.json();
      setSimResult(data);
      showToast(`Réponse WhatsApp reçue : ${simMessage} ➡️ Statut : ${data.action}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (appointments.length === 0) return;
    const headers = ["Heure", "Patient", "Telephone", "Service", "Prix (DH)", "Statut", "Notes"];
    const rows = appointments.map((a) => [
      formatFrenchTime(a.startTime),
      `"${a.patient.fullName}"`,
      `"${a.patient.phoneNumber}"`,
      `"${a.service.name}"`,
      a.service.price || 0,
      a.status,
      `"${a.notes || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agenda-${selectedClinicSlug}-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // KPIs Calculations
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const noShowCount = appointments.filter((a) => a.status === "NO_SHOW").length;
  const estimatedRevenue = appointments
    .filter((a) => a.status !== "CANCELLED" && a.status !== "NO_SHOW")
    .reduce((acc, curr) => acc + (curr.service.price || 0), 0);

  // Filtered by Search
  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patient.phoneNumber.includes(searchTerm) ||
      a.service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 print:bg-white">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-2xl animate-bounce">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 print:p-0">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Top Bar with Clinic Switcher & Quick Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Agenda & CRM Médical
                </h1>

                {/* Multi-Clinic Dropdown Switcher */}
                {clinics.length > 0 && (
                  <div className="relative inline-block">
                    <select
                      value={selectedClinicSlug}
                      onChange={(e) => {
                        const targetSlug = e.target.value;
                        setSelectedClinicSlug(targetSlug);
                        const c = clinics.find((item) => item.slug === targetSlug);
                        if (c) setSelectedClinic(c);
                      }}
                      className="appearance-none rounded-xl border border-emerald-600/30 bg-emerald-50 py-1.5 pl-8 pr-8 text-xs font-extrabold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer shadow-sm"
                    >
                      {clinics.map((c) => (
                        <option key={c.id} value={c.slug}>
                          🏥 {c.name} ({c.doctorName})
                        </option>
                      ))}
                    </select>
                    <Building2 className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-700" />
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-700" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>Gestion des flux patients, confirmations WhatsApp et suivi des présences en temps réel.</span>
                {selectedClinic && (
                  <Link
                    href={`/${selectedClinic.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                  >
                    Voir page patient <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Print Today's Sheet */}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                title="Imprimer l'agenda du jour pour le médecin"
              >
                <Printer className="h-4 w-4" />
                Imprimer l'Agenda
              </button>

              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                title="Télécharger les données en format Excel / CSV"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>

              {/* WhatsApp Inbound Simulator Button */}
              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Simulateur WhatsApp
              </button>

              {/* Add Manual Appointment Button */}
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Nouveau RDV Manuel
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 print:hidden">
            {/* KPI 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Rendez-vous du jour</span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{totalCount}</p>
              <span className="text-[11px] text-slate-400">Total planifié</span>
            </div>

            {/* KPI 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirmés WhatsApp
              </span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                {confirmedCount}
              </p>
              <span className="text-[11px] text-slate-400">
                {totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0}% du total
              </span>
            </div>

            {/* KPI 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> En Attente
              </span>
              <p className="mt-1 text-2xl font-extrabold text-amber-600">{pendingCount}</p>
              <span className="text-[11px] text-slate-400">À relancer</span>
            </div>

            {/* KPI 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Absences (No-Show)
              </span>
              <p className="mt-1 text-2xl font-extrabold text-red-600">{noShowCount}</p>
              <span className="text-[11px] text-slate-400">Créneaux perdus</span>
            </div>

            {/* KPI 5 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> C.A Estimé
              </span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {estimatedRevenue} DH
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">Journée active</span>
            </div>
          </div>

          {/* Quick Date Filters & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
            {/* Date Quick Pickers */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-sm"
              />
              <button
                onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  selectedDate === format(new Date(), "yyyy-MM-dd")
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setSelectedDate(format(addDays(new Date(), 1), "yyyy-MM-dd"))}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  selectedDate === format(addDays(new Date(), 1), "yyyy-MM-dd")
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Demain
              </button>
            </div>

            {/* Search and Status filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher patient, tél, soin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="CONFIRMED">Confirmés (WA)</option>
                <option value="PENDING">En Attente</option>
                <option value="COMPLETED">Présent / Traité</option>
                <option value="CANCELLED">Annulé</option>
                <option value="NO_SHOW">No-Show</option>
              </select>

              <button
                onClick={fetchAppointments}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                title="Actualiser"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Main Appointments Table (With Clean Print Styling) */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm print:border-none print:shadow-none">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Planning des Rendez-vous ({filteredAppointments.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedClinic?.name || "Cabinet"} • {formatFrenchDate(selectedDate)}
                </p>
              </div>
              <span className="hidden print:inline-block text-xs font-bold text-slate-400">
                Imprimé via MediAppoint WA
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                <p className="mt-2 text-xs font-medium">Chargement de l'agenda...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">Aucun rendez-vous trouvé</p>
                <p className="text-xs text-slate-400 mt-1">
                  Aucun patient n'est programmé pour ce filtre.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Heure</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Soin & Tarif</th>
                      <th className="py-3 px-4">Statut WA</th>
                      <th className="py-3 px-4 print:hidden">Dernier Message WA</th>
                      <th className="py-3 px-4 text-right print:hidden">Actions Secrétaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredAppointments.map((appt) => {
                      const timeStr = formatFrenchTime(appt.startTime);
                      const latestLog = appt.whatsappLogs?.[0];

                      return (
                        <tr
                          key={appt.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* Time */}
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-lg">
                              {timeStr}
                            </span>
                          </td>

                          {/* Patient */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{appt.patient.fullName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="h-3 w-3 text-emerald-600" />
                              {appt.patient.phoneNumber}
                            </div>
                            {appt.notes && (
                              <div className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 line-clamp-1">
                                📝 {appt.notes}
                              </div>
                            )}
                          </td>

                          {/* Service */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800">
                              {appt.service.name}
                            </span>
                            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                              {formatPrice(appt.service.price)} ({appt.service.durationMin} min)
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            {appt.status === "CONFIRMED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Confirmé WA
                              </span>
                            )}
                            {appt.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                                En Attente
                              </span>
                            )}
                            {appt.status === "COMPLETED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                                <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                                Présent / Traité
                              </span>
                            )}
                            {appt.status === "CANCELLED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 line-through">
                                <XCircle className="h-3.5 w-3.5 text-slate-500" />
                                Annulé
                              </span>
                            )}
                            {appt.status === "NO_SHOW" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                                No-Show
                              </span>
                            )}
                          </td>

                          {/* WhatsApp Log preview */}
                          <td className="py-3.5 px-4 print:hidden">
                            {latestLog ? (
                              <div className="text-[11px] text-slate-600 max-w-xs">
                                <span className="font-semibold text-emerald-800">
                                  {latestLog.messageType}
                                </span>
                                {latestLog.responseReceived && (
                                  <span className="ml-1.5 rounded bg-emerald-50 px-1 py-0.5 font-bold text-emerald-700">
                                    Réponse: "{latestLog.responseReceived}"
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Aucun envoi</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right print:hidden">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Mark as Present / Checked-in */}
                              {appt.status !== "COMPLETED" && appt.status !== "CANCELLED" && (
                                <button
                                  onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                                  className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                                  title="Marquer comme Présent / Traité"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                              )}

                              {/* Send Manual WhatsApp Reminder */}
                              {appt.status !== "CANCELLED" && (
                                <button
                                  onClick={() => handleSendReminder(appt.id)}
                                  className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                                  title="Envoyer un rappel WhatsApp direct"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              )}

                              {/* Mark No-Show */}
                              {appt.status !== "NO_SHOW" && appt.status !== "CANCELLED" && (
                                <button
                                  onClick={() => handleUpdateStatus(appt.id, "NO_SHOW")}
                                  className="rounded-lg bg-amber-50 p-1.5 text-amber-700 hover:bg-amber-100"
                                  title="Signaler No-Show (Absence)"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </button>
                              )}

                              {/* Cancel Booking */}
                              {appt.status !== "CANCELLED" && (
                                <button
                                  onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                                  className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                                  title="Annuler le rendez-vous"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: MANUAL APPOINTMENT (Prise de RDV au téléphone) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Ajouter un Rendez-vous (Appel / Direct)
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom & Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mohammed Tazi"
                  value={manualForm.fullName}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Numéro WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="06..."
                  value={manualForm.phoneNumber}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, phoneNumber: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service / Soin</label>
                <select
                  value={manualForm.serviceId}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, serviceId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatPrice(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date & Heure</label>
                <input
                  type="datetime-local"
                  required
                  value={manualForm.startTime}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, startTime: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarques</label>
                <textarea
                  rows={2}
                  placeholder="Notes..."
                  value={manualForm.notes}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, notes: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingManual}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {creatingManual ? "Enregistrement..." : "Enregistrer & Envoyer WA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WHATSAPP INTERACTIVE SIMULATOR */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Simulateur de Réponses WhatsApp (Patient)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Testez en direct ce qui se passe quand un patient répond sur WhatsApp.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSimulatorOpen(false);
                  setSimResult(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateWebhook} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Numéro de Téléphone du Patient (qui répond)
                </label>
                <input
                  type="text"
                  required
                  value={simPhone}
                  onChange={(e) => setSimPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Message / Action envoyée par le Patient :
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setSimMessage("OUI")}
                    className={`p-2 rounded-xl border font-bold ${
                      simMessage === "OUI"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    ✅ "OUI" (Confirmer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMessage("1")}
                    className={`p-2 rounded-xl border font-bold ${
                      simMessage === "1"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    1️⃣ "1" (Touche 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimMessage("ANNULER")}
                    className={`p-2 rounded-xl border font-bold ${
                      simMessage === "ANNULER"
                        ? "border-red-600 bg-red-50 text-red-800"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    ❌ "ANNULER"
                  </button>
                </div>
                <input
                  type="text"
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="Tapez un message personnalisé..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {simResult && (
                <div className="rounded-2xl bg-[#EFEAE2] p-3.5 border border-[#d1d7db] text-xs">
                  <p className="font-bold text-emerald-900 text-[11px] mb-1">
                    Réponse automatique du Webhook :
                  </p>
                  <div className="rounded-xl bg-white p-3 shadow-sm border-l-4 border-emerald-600">
                    <p className="font-semibold text-slate-800">
                      Statut mis à jour : <strong>{simResult.action}</strong>
                    </p>
                    <p className="whitespace-pre-line text-[11px] text-slate-600 mt-1">
                      {simResult.responseReply || simResult.reason}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={simulating}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {simulating ? "Traitement..." : "Envoyer Message Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
