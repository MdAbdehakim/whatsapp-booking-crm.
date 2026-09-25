"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Stethoscope,
  Plus,
  Trash2,
  Edit2,
  Clock,
  DollarSign,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number | null;
  description: string | null;
  color: string;
}

export default function ServicesManagerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [clinicId, setClinicId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    durationMin: 30,
    price: "300",
    description: "",
    color: "#128C7E",
  });
  const [saving, setSaving] = useState(false);

  async function loadClinicAndServices() {
    try {
      setLoading(true);
      const res = await fetch("/api/clinics/dr-amine-bennani");
      const data = await res.json();
      if (data) {
        setClinicId(data.id);
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClinicAndServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      name: "",
      durationMin: 30,
      price: "300",
      description: "",
      color: "#128C7E",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setForm({
      name: srv.name,
      durationMin: srv.durationMin,
      price: srv.price ? String(srv.price) : "",
      description: srv.description || "",
      color: srv.color || "#128C7E",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingService) {
        // PATCH
        const res = await fetch("/api/services", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingService.id,
            name: form.name,
            durationMin: Number(form.durationMin),
            price: form.price ? Number(form.price) : null,
            description: form.description,
            color: form.color,
          }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          loadClinicAndServices();
        }
      } else {
        // POST
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clinicId,
            name: form.name,
            durationMin: Number(form.durationMin),
            price: form.price ? Number(form.price) : null,
            description: form.description,
            color: form.color,
          }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          loadClinicAndServices();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadClinicAndServices();
      } else {
        const d = await res.json();
        alert(d.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      alert("Erreur de suppression.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
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
                Gestion des Services & Tarifs
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configurez les actes médicaux proposés aux patients lors de la réservation en ligne.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Nouveau Soin / Prestation
            </button>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-2 text-xs">Chargement des services...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">{srv.name}</h3>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {formatPrice(srv.price)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[32px]">
                      {srv.description || "Aucune description renseignée."}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{srv.durationMin} minutes</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Add / Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              {editingService ? "Modifier le Soin" : "Ajouter un Nouveau Soin"}
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom du service</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Blanchiment Laser"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarif (DH)</label>
                  <input
                    type="number"
                    placeholder="300"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durée (minutes)</label>
                  <select
                    value={form.durationMin}
                    onChange={(e) =>
                      setForm({ ...form, durationMin: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value={15}>15 min</option>
                    <option value={20}>20 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Description détaillée du soin..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
