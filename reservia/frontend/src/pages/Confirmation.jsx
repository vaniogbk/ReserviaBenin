import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/api'
import { jsPDF } from 'jspdf'
import {
  FaCheckCircle, FaClock, FaDownload, FaHome,
  FaCalendarAlt, FaUsers, FaTag, FaEnvelope,
  FaMapMarkerAlt, FaCreditCard, FaFileAlt
} from 'react-icons/fa'

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmt(n) {
  return parseFloat(n || 0).toLocaleString('fr-FR')
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function methodLabel(m) {
  const map = {
    mtn_momo: 'MTN Mobile Money',
    moov_money: 'Moov Money',
    fedapay: 'FedaPay (Carte)',
    cinetpay: 'CinetPay (Carte)',
    carte_credit: 'Carte bancaire',
    mobile_money: 'Mobile Money',
  }
  return map[m] || m || '—'
}

// ─── PDF Generator ─────────────────────────────────────────────────────────

function genererPDF(r, ref) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 18

  // ── Header band ──
  doc.setFillColor(30, 24, 16)           // dark
  doc.rect(0, 0, W, 42, 'F')

  // Logo text
  doc.setTextColor(196, 169, 122)        // earth
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('RESERVIA', margin, 18)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text('BÉNIN', margin + 52, 18)
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(8)
  doc.text('Plateforme de réservation touristique', margin, 25)

  // Ref badge (right side)
  doc.setFillColor(196, 96, 58)          // terracotta
  doc.roundedRect(W - 72, 10, 56, 22, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('RÉFÉRENCE', W - 72 + 28, 18, { align: 'center' })
  doc.setFontSize(12)
  doc.text(ref, W - 72 + 28, 26, { align: 'center' })

  // ── Success banner ──
  doc.setFillColor(220, 252, 231)        // green-100
  doc.rect(0, 42, W, 16, 'F')
  doc.setTextColor(21, 128, 61)          // green-700
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('✓  RÉSERVATION CONFIRMÉE — PAIEMENT REÇU', W / 2, 52, { align: 'center' })

  // ── Section: Ce que vous avez réservé ──
  let y = 72
  const sectionTitle = (label, yPos) => {
    doc.setFillColor(245, 239, 224)      // sand
    doc.rect(margin, yPos - 5, W - margin * 2, 10, 'F')
    doc.setTextColor(196, 96, 58)        // terracotta
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(label.toUpperCase(), margin + 4, yPos + 2)
    return yPos + 12
  }

  const row = (label, value, yPos, bold = false) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 100, 80)
    doc.text(label, margin + 4, yPos)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(30, 24, 16)
    doc.text(String(value), W - margin - 4, yPos, { align: 'right' })
    // separator
    doc.setDrawColor(230, 220, 200)
    doc.setLineWidth(0.2)
    doc.line(margin + 4, yPos + 2, W - margin - 4, yPos + 2)
    return yPos + 9
  }

  y = sectionTitle('Détails de la réservation', y)

  if (r?.hebergement?.titre)
    y = row('Hébergement', r.hebergement.titre, y)
  if (r?.evenement?.titre)
    y = row('Événement', r.evenement.titre, y)
  if (r?.date_debut)
    y = row('Date d\'arrivée', fmtDate(r.date_debut), y)
  if (r?.date_fin)
    y = row('Date de départ', fmtDate(r.date_fin), y)
  if (r?.nombre_guests)
    y = row('Voyageurs', `${r.nombre_guests} personne${r.nombre_guests > 1 ? 's' : ''}`, y)
  if (r?.notes)
    y = row('Notes', r.notes, y)

  y += 4
  y = sectionTitle('Informations client', y)

  if (r?.user?.prenom || r?.user?.nom)
    y = row('Nom complet', `${r.user.prenom || ''} ${r.user.nom || ''}`.trim(), y)
  if (r?.user?.email)
    y = row('Email', r.user.email, y)
  if (r?.user?.telephone)
    y = row('Téléphone', r.user.telephone, y)

  y += 4
  y = sectionTitle('Récapitulatif financier', y)

  if (r?.paiement?.methode || r?.methode_paiement)
    y = row('Mode de paiement', methodLabel(r?.paiement?.methode || r?.methode_paiement), y)
  if (r?.paiement?.reference_externe)
    y = row('Réf. transaction', r.paiement.reference_externe, y)

  // Total box
  y += 2
  doc.setFillColor(30, 24, 16)
  doc.roundedRect(margin, y, W - margin * 2, 14, 3, 3, 'F')
  doc.setTextColor(196, 169, 122)        // earth
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('MONTANT TOTAL PAYÉ', margin + 6, y + 9)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text(`${fmt(r?.prix_total)} FCFA`, W - margin - 6, y + 9, { align: 'right' })

  // ── Footer ──
  y = 272
  doc.setDrawColor(196, 169, 122)
  doc.setLineWidth(0.5)
  doc.line(margin, y, W - margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(150, 130, 100)
  doc.text('Reservia Bénin — contact@reservia.bj — www.reservia.bj', W / 2, y + 6, { align: 'center' })
  doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, W / 2, y + 12, { align: 'center' })
  doc.setTextColor(200, 80, 50)
  doc.text('Ce document tient lieu de reçu officiel de paiement.', W / 2, y + 18, { align: 'center' })

  doc.save(`recu-reservia-${ref}.pdf`)
}

// ─── Info Row ───────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between py-3 border-b border-earth/10 last:border-0">
      <span className="flex items-center gap-2 text-earth text-sm">
        <Icon size={12} className="flex-shrink-0 mt-0.5" />
        {label}
      </span>
      <span className="font-medium text-dark text-sm text-right max-w-[55%]">{value}</span>
    </div>
  )
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="pt-16 min-h-screen bg-sand flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-earth/20 animate-pulse" />
        <div className="w-48 h-6 rounded-lg bg-earth/20 animate-pulse" />
        <div className="w-32 h-4 rounded-lg bg-earth/10 animate-pulse" />
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Confirmation() {
  const { ref } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['reservation', ref],
    queryFn: () => reservationApi.detail(ref),
  })
  const r = data?.data

  if (isLoading) return <Skeleton />

  const estConfirme = r?.statut === 'confirmée' || r?.statut_paiement === 'payé'

  // ── Pending state ──
  if (!estConfirme) {
    return (
      <div className="pt-16 min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-28 h-28 rounded-full bg-amber-50 border-4 border-amber-200
            flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaClock className="text-amber-400" size={44} />
          </div>
          <h1 className="font-display text-4xl font-light text-dark mb-3">
            Paiement en attente
          </h1>
          <p className="text-earth mb-2">
            Référence : <span className="font-mono font-bold text-terracotta tracking-wider">{ref}</span>
          </p>
          <p className="text-earth/70 text-sm mb-8">
            Votre paiement est en cours de traitement. Vous recevrez une confirmation par e-mail dès validation.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8">
            <FaHome size={14} /> Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  // ── Success state ──
  return (
    <div className="pt-16 min-h-screen bg-sand">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-dark via-[#2a2018] to-[#1a3a1a] text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated check */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-28 h-28 rounded-full bg-green-500/20 animate-ping absolute" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600
              flex items-center justify-center shadow-2xl shadow-green-900/50 relative z-10">
              <FaCheckCircle className="text-white" size={40} />
            </div>
          </div>

          <h1 className="font-display text-5xl font-light mb-3 tracking-wide">
            Réservation confirmée !
          </h1>
          <p className="text-earth text-lg mb-6">
            Votre paiement a été reçu et votre réservation est validée.
          </p>

          {/* Reference chip */}
          <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur border border-white/10
            rounded-2xl px-8 py-4 gap-1">
            <span className="text-earth/60 text-xs uppercase tracking-widest">Référence</span>
            <span className="font-mono font-bold text-2xl text-earth tracking-[6px]">{ref}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Main receipt card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          {/* Card header */}
          <div className="bg-gradient-to-r from-terracotta to-terracotta/80 px-6 py-4
            flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-white/80" size={18} />
              <span className="text-white font-semibold">Récapitulatif de réservation</span>
            </div>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-mono">
              {ref}
            </span>
          </div>

          <div className="p-6 space-y-1">

            {/* Resource */}
            {(r?.hebergement || r?.evenement) && (
              <div className="bg-sand rounded-2xl p-4 mb-4">
                <p className="text-xs text-earth uppercase tracking-widest mb-1">
                  {r?.hebergement ? 'Hébergement' : 'Événement'}
                </p>
                <p className="font-display text-xl font-semibold text-dark">
                  {r?.hebergement?.titre || r?.evenement?.titre}
                </p>
                {(r?.hebergement?.localisation || r?.evenement?.lieu) && (
                  <p className="flex items-center gap-1.5 text-earth text-sm mt-1">
                    <FaMapMarkerAlt size={10} />
                    {r?.hebergement?.localisation || r?.evenement?.lieu}
                  </p>
                )}
              </div>
            )}

            {/* Details */}
            <InfoRow icon={FaCalendarAlt} label="Arrivée" value={fmtDate(r?.date_debut)} />
            <InfoRow icon={FaCalendarAlt} label="Départ" value={fmtDate(r?.date_fin)} />
            <InfoRow
              icon={FaUsers}
              label="Voyageurs"
              value={r?.nombre_guests ? `${r.nombre_guests} personne${r.nombre_guests > 1 ? 's' : ''}` : null}
            />
            <InfoRow icon={FaCreditCard} label="Mode de paiement"
              value={methodLabel(r?.paiement?.methode || r?.methode_paiement)} />
            {r?.paiement?.reference_externe && (
              <InfoRow icon={FaTag} label="Réf. transaction" value={r.paiement.reference_externe} />
            )}
          </div>

          {/* Total footer */}
          <div className="bg-dark mx-6 mb-6 rounded-2xl px-6 py-4 flex items-center justify-between">
            <span className="text-earth text-sm font-medium">Montant total payé</span>
            <span className="font-display text-2xl font-bold text-white">
              {fmt(r?.prix_total)}&nbsp;<span className="text-earth text-base">FCFA</span>
            </span>
          </div>

          {/* Status badge */}
          <div className="mx-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl py-3 text-center
              flex items-center justify-center gap-2">
              <FaCheckCircle className="text-green-500" size={14} />
              <span className="text-green-700 text-sm font-semibold">
                Paiement confirmé — statut : {r?.statut_paiement || 'payé'}
              </span>
            </div>
          </div>
        </div>

        {/* Client info card */}
        {r?.user && (
          <div className="bg-white rounded-3xl shadow-sm px-6 py-5">
            <p className="text-xs text-earth uppercase tracking-widest mb-4">Informations client</p>
            <InfoRow
              icon={FaUsers}
              label="Nom"
              value={`${r.user.prenom || ''} ${r.user.nom || ''}`.trim() || null}
            />
            <InfoRow icon={FaEnvelope} label="Email" value={r.user.email} />
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/"
            className="flex items-center justify-center gap-2 bg-dark text-white
              rounded-2xl py-3.5 px-5 font-medium text-sm
              hover:bg-dark/90 transition-colors">
            <FaHome size={14} /> Accueil
          </Link>

          <button
            onClick={() => genererPDF(r, ref)}
            className="flex items-center justify-center gap-2 bg-terracotta text-white
              rounded-2xl py-3.5 px-5 font-medium text-sm
              hover:bg-terracotta/90 transition-colors">
            <FaDownload size={14} /> Télécharger reçu PDF
          </button>

          <Link to="/profil"
            className="flex items-center justify-center gap-2 border-2 border-earth/30 text-dark
              rounded-2xl py-3.5 px-5 font-medium text-sm
              hover:border-earth transition-colors">
            <FaCalendarAlt size={14} /> Mes réservations
          </Link>
        </div>

        {/* Email notice */}
        <p className="text-center text-xs text-earth/70 flex items-center justify-center gap-1.5 pb-4">
          <FaEnvelope size={10} />
          Un récapitulatif complet vous a été envoyé par email
        </p>
      </div>
    </div>
  )
}
