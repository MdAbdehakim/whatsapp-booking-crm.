import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  MessageSquare,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Check,
  Star,
  Phone,
  MapPin,
  Zap,
  BarChart3,
  QrCode,
  Globe,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36 bg-gradient-to-b from-slate-50 to-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-200/30 to-teal-100/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Plateforme N°1 de gestion de RDV au Maroc
            </div>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
              Réduisez vos absences de{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                75% grâce à WhatsApp
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Vos patients réservent en ligne, reçoivent des confirmations et rappels automatiques sur WhatsApp. Votre assistante gagne 2 heures par jour.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 hover:shadow-xl"
              >
                Commencer gratuitement — 14 jours
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Voir une démo
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="mt-14 flex flex-wrap justify-center gap-8 border-t border-slate-200 pt-8">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-slate-900">-75%</p>
                <p className="mt-1 text-sm text-slate-500">d'absences patients</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-emerald-600">98%</p>
                <p className="mt-1 text-sm text-slate-500">taux de lecture WhatsApp</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-slate-900">&lt; 2 min</p>
                <p className="mt-1 text-sm text-slate-500">pour réserver un RDV</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-slate-900">+50</p>
                <p className="mt-1 text-sm text-slate-500">cabinets nous font confiance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Fonctionnalités</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Tout ce dont votre cabinet a besoin
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Une solution complète pour digitaliser la gestion de vos rendez-vous et améliorer la communication avec vos patients.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Confirmation WhatsApp</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Confirmation instantanée avec détails du RDV, adresse et lien Google Maps envoyés directement sur WhatsApp.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Rappels T-24h</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Rappel automatique 24h avant le RDV. Le patient confirme ou annule d'un clic — le créneau est libéré automatiquement.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Anti-Double Booking</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Algorithme temps réel qui empêche deux patients de réserver le même créneau. Zéro conflit d'horaire.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Multilingue (FR / AR / Darija)</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Page de réservation disponible en Français, Arabe et Darija avec support RTL. Chaque patient réserve dans sa langue.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Dashboard & CRM</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Tableau de bord complet avec KPIs, fiches patients, historique des no-shows, et chiffre d'affaires en temps réel.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-lg hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">QR Code & Affiche</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Générez une affiche professionnelle avec QR code pour votre salle d'attente. Vos patients scannent et réservent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="temoignages" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Témoignages</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Ils nous font confiance
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex gap-1 text-amber-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-slate-600 leading-relaxed">
                &quot;Depuis qu'on utilise MediAppoint, nos no-shows ont chuté de 80%. Les patients adorent recevoir le rappel sur WhatsApp, c'est naturel pour eux.&quot;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">SA</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dr. Sarah Alami</p>
                  <p className="text-xs text-slate-500">Dentiste — Rabat</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex gap-1 text-amber-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-slate-600 leading-relaxed">
                &quot;Mon assistante passait 3 heures par jour au téléphone pour les rappels. Maintenant tout est automatique. On ne revient plus en arrière.&quot;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-800 text-sm">YB</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dr. Youssef Benkirane</p>
                  <p className="text-xs text-slate-500">Orthodontiste — Casablanca</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex gap-1 text-amber-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-slate-600 leading-relaxed">
                &quot;Le QR code dans la salle d'attente est génial. Les patients réservent leur prochain RDV avant même de partir. Simple et efficace.&quot;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-800 text-sm">NE</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dr. Nadia El Mansouri</p>
                  <p className="text-xs text-slate-500">Dermatologue — Tanger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Tarifs</span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Un investissement rentabilisé dès le premier RDV sauvé
            </h2>
            <p className="mt-4 text-slate-600">
              Sans engagement. Essai gratuit de 14 jours. Support d'intégration inclus.
            </p>
          </div>

          <div className="mt-14 grid gap-8 max-w-4xl mx-auto md:grid-cols-2">
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
                  <span className="text-4xl font-extrabold text-slate-900">290 DH</span>
                  <span className="text-sm font-medium text-slate-500">/ mois</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Idéal pour les médecins indépendants et dentistes en cabinet solo.</p>

                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Réservation en ligne illimitée
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> 300 messages WhatsApp / mois
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Confirmation + Rappel T-24h
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> 1 compte Secrétaire
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> QR Code & Affiche imprimable
                  </li>
                </ul>
              </div>

              <Link
                href="/onboarding"
                className="mt-8 block w-full rounded-xl border-2 border-emerald-600 bg-white py-3.5 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                Commencer l'essai gratuit
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="relative rounded-3xl border-2 border-emerald-600 bg-white p-8 shadow-xl shadow-emerald-600/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                Le Plus Populaire
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Cabinet Pro</h3>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                    Multi-praticiens
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">590 DH</span>
                  <span className="text-sm font-medium text-slate-500">/ mois</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Pour les cliniques, cabinets de groupe et centres médicaux.</p>

                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Tout ce qui est dans Starter
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Jusqu'à 5 Praticiens
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> 1 000 messages WhatsApp / mois
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Dashboard CRM avancé
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Support prioritaire WhatsApp
                  </li>
                </ul>
              </div>

              <Link
                href="/onboarding"
                className="mt-8 block w-full rounded-xl bg-emerald-600 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Commencer l'essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Prêt à réduire vos absences ?
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            Rejoignez les +50 cabinets qui ont déjà transformé leur gestion de RDV.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
          >
            Démarrer mon essai gratuit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-white">
                  Medi<span className="text-emerald-400">Appoint</span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed max-w-xs">
                La plateforme intelligente de prise de rendez-vous avec confirmations et rappels automatiques par WhatsApp.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="#fonctionnalites" className="hover:text-emerald-400 transition">Fonctionnalités</Link></li>
                <li><Link href="#tarifs" className="hover:text-emerald-400 transition">Tarifs</Link></li>
                <li><Link href="#temoignages" className="hover:text-emerald-400 transition">Témoignages</Link></li>
                <li><Link href="/onboarding" className="hover:text-emerald-400 transition">Essai Gratuit</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <a href="https://wa.me/212600000000" className="hover:text-emerald-400 transition">WhatsApp</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Témara, Maroc 🇲🇦
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 MediAppoint. Tous droits réservés.</p>
            <div className="flex gap-6">
              <span className="hover:text-emerald-400 cursor-pointer">Mentions Légales</span>
              <span className="hover:text-emerald-400 cursor-pointer">Politique de Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/212600000000?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20MediAppoint."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition hover:bg-green-600 hover:scale-110"
        title="Contactez-nous sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
