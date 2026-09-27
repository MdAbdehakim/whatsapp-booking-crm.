import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Phone,
  Users,
  MapPin,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-200/40 to-teal-100/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Left Column: Value Prop */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>SaaS Dédié aux Cabinets Médicaux &amp; Professions Libérales</span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Divisez vos rendez-vous manqués par 3 grâce à{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  WhatsApp Automatisé
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 sm:text-xl">
                Offrez à vos patients une page de réservation en ligne ultra-rapide. Les confirmations et rappels à <strong>T-24h</strong> sont envoyés directement sur <strong>WhatsApp</strong>. Votre assistante gagne 2 heures par jour.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-98"
                >
                  <Calendar className="h-5 w-5" />
                  Créer la Page de votre Cabinet
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Voir le Dashboard Secrétaire
                </Link>
              </div>

              {/* Social Proof metrics */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6">
                <div>
                  <p className="text-2xl font-bold text-slate-900">-75%</p>
                  <p className="text-xs text-slate-500">Taux de No-Show (Absences)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">100%</p>
                  <p className="text-xs text-slate-500">Taux d'ouverture WhatsApp</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">&lt; 2 min</p>
                  <p className="text-xs text-slate-500">Temps moyen de prise de RDV</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="bg-white py-20 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Pourquoi les cabinets choisissent MediAppoint WA ?
            </h2>
            <p className="mt-4 text-slate-600">
              Les SMS sont ignorés et les e-mails finissent dans les spams. WhatsApp a un taux de lecture de 98% au Maroc et en région MENA.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Confirmation WhatsApp</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Le patient reçoit instantanément les détails du rendez-vous, l'adresse exacte et le lien Google Maps directement dans son WhatsApp.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Rappels Automatiques</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Un rappel à T-24h demande au patient de confirmer sa présence d'un simple clic. S'il annule, le créneau est automatiquement libéré pour un autre patient.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Anti-Double Booking</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Algorithme temps réel avec verrous de base de données (Database locking) pour empêcher deux patients de réserver la même minute.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Dashboard Assistante</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Agenda interactif clair et rapide. Vos assistantes voient en temps réel qui est confirmé, qui est dans la salle d'attente, et les no-shows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Targeted for Morocco & MENA) */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Tarifs Transparents
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Un investissement rentabilisé dès le premier rendez-vous sauvé
            </h2>
            <p className="mt-3 text-slate-600">
              Sans engagement de durée. Essai gratuit de 14 jours avec support d'intégration inclus.
            </p>
          </div>

          <div className="mt-12 grid gap-8 max-w-4xl mx-auto md:grid-cols-2">
            {/* Plan Starter */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Cabinet Starter</h3>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    1 Praticien
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">390 DH</span>
                  <span className="text-sm font-medium text-slate-500">/ mois</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Idéal pour les médecins indépendants et dentistes en cabinet solo.</p>

                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Prise de RDV en ligne illimitée
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> 300 messages WhatsApp automatiques / mois
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Confirmation et Rappel T-24h
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> 1 compte Secrétaire inclus
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Synchronisation Google Maps
                  </li>
                </ul>
              </div>

              <Link
                href="/dr-amine-bennani"
                className="mt-8 block w-full rounded-xl border border-slate-300 bg-white py-3 text-center text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Tester la démo
              </Link>
            </div>

            {/* Plan Pro / Multi-praticiens */}
            <div className="relative rounded-3xl border-2 border-emerald-600 bg-white p-8 shadow-xl shadow-emerald-600/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                Le Plus Populaire
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Cabinet Pro / Clinique</h3>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                    Multi-praticiens
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">790 DH</span>
                  <span className="text-sm font-medium text-slate-500">/ mois</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Pour les cliniques esthétiques, cabinets de groupe et centres médicaux.</p>

                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 font-bold" /> Tout ce qui est dans Starter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Jusqu'à 5 Praticiens / Agendas séparés
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> 1 000 messages WhatsApp automatiques / mois
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Rappel T-2h + Gestion des urgences
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" /> Support VIP par WhatsApp dédié
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="mt-8 block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Accéder au Dashboard Cabinet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediAppoint WA. Conçu pour les cabinets médicaux d'élite et les professionnels libéraux.</p>
          <div className="flex gap-4">
            <Link href="/dr-amine-bennani" className="hover:text-emerald-600">Page Patient</Link>
            <Link href="/dashboard" className="hover:text-emerald-600">Dashboard CRM</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
