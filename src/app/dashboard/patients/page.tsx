"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Users,
  Search,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowLeft,
  Loader2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatFrenchDate, formatFrenchTime, formatPrice } from "@/lib/utils";

interface PatientRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  notes: string | null;
  createdAt: string;
  appointments: {
    id: string;
    startTime: string;
    status: string;
    notes: string | null;
    service: {
      name: string;
      price: number | null;
    };
  }[];
  stats: {
    totalAppointments: number;
    completedCount: number;
    noShowCount: number;
    cancelledCount: number;
    totalRevenue: number;
    reliabilityScore: number;
  };
}

export default function PatientsCRMPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  async function loadPatients() {
    try {
      setLoading(true);
      const res = await fetch(`/api/patients?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, [searchTerm]);

  const totalPatients = patients.length;
  const totalRevenueAll = patients.reduce((sum, p) => sum + p.stats.totalRevenue, 0);
  const highRiskNoShows = patients.filter((p) => p.stats.noShowCount > 0).length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Retour au Dashboard
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Fiches & Historique des Patients (CRM)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultez les antécédents de visites, le taux de ponctualité et les notes médicales de chaque patient.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2.5 text-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-sm"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-600" /> Total Patients Enregistrés
              </span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{totalPatients}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Chiffre d'Affaires Réalisé
              </span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{totalRevenueAll} DH</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-medium text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Patients avec No-Shows
              </span>
              <p className="mt-1 text-2xl font-extrabold text-amber-600">{highRiskNoShows}</p>
            </div>
          </div>

          {/* Patients List Table */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Liste des Fiches Patients ({patients.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                <p className="mt-2 text-xs">Chargement des fiches patients...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">Aucun patient trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Téléphone / WhatsApp</th>
                      <th className="py-3 px-4">Total Visites</th>
                      <th className="py-3 px-4">Indice de Fiabilité</th>
                      <th className="py-3 px-4">Dépenses Cumulées</th>
                      <th className="py-3 px-4 text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {patients.map((p) => {
                      const isHighRisk = p.stats.noShowCount > 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Patient Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">{p.fullName}</div>
                            {p.notes && (
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                {p.notes}
                              </p>
                            )}
                          </td>

                          {/* Phone */}
                          <td className="py-3.5 px-4">
                            <a
                              href={`https://wa.me/${p.phoneNumber.replace("+", "")}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              {p.phoneNumber}
                            </a>
                          </td>

                          {/* Total Appointments */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-800">
                              {p.stats.totalAppointments} rendez-vous
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {p.stats.completedCount} honorés • {p.stats.noShowCount} absences
                            </div>
                          </td>

                          {/* Reliability Score Badge */}
                          <td className="py-3.5 px-4">
                            {isHighRisk ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-700">
                                <AlertTriangle className="h-3 w-3" />
                                {p.stats.reliabilityScore}% ({p.stats.noShowCount} No-Shows)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                100% Fiable
                              </span>
                            )}
                          </td>

                          {/* Revenue */}
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {formatPrice(p.stats.totalRevenue)}
                          </td>

                          {/* Action Modal */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedPatient(p)}
                              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Voir Dossier
                            </button>
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

      {/* MODAL: FULL PATIENT DOSSIER & HISTORY */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Dossier Patient : {selectedPatient.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {selectedPatient.phoneNumber}
                  {selectedPatient.email && `• ${selectedPatient.email}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 my-5 text-center text-xs">
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-medium">Total Visites</span>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {selectedPatient.stats.totalAppointments}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-100">
                <span className="text-emerald-800 font-medium">Fiabilité</span>
                <p className="text-lg font-bold text-emerald-700 mt-1">
                  {selectedPatient.stats.reliabilityScore}%
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-medium">Total Dépensé</span>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {selectedPatient.stats.totalRevenue} DH
                </p>
              </div>
            </div>

            {/* Medical Notes / Antecedents */}
            {selectedPatient.notes && (
              <div className="rounded-2xl bg-amber-50/80 p-4 border border-amber-200 text-xs text-amber-900 mb-5">
                <p className="font-bold mb-1">📝 Notes & Symptômes enregistrés :</p>
                <p className="leading-relaxed">{selectedPatient.notes}</p>
              </div>
            )}

            {/* Appointment Timeline History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Historique chronologique des rendez-vous ({selectedPatient.appointments.length}) :
              </h4>

              <div className="space-y-2.5">
                {selectedPatient.appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {appt.service.name}
                      </span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {formatFrenchDate(appt.startTime)} à {formatFrenchTime(appt.startTime)}
                      </p>
                      {appt.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          appt.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : appt.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : appt.status === "NO_SHOW"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {appt.status}
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {formatPrice(appt.service.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                Fermer le dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
