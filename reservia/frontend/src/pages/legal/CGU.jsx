import { Link } from 'react-router-dom'

export default function CGU() {
  return (
    <div className="min-h-screen pt-16 bg-sand">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14">

        <div className="mb-10">
          <Link to="/" className="text-terracotta text-sm hover:underline">← Retour à l'accueil</Link>
          <h1 className="font-display text-3xl text-dark mt-4 mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-earth text-sm">Dernière mise à jour : mai 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8 text-dark/80 leading-relaxed">

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme
              Réservia Bénin, accessible à l'adresse <strong>reservia-benin.vercel.app</strong>. En créant un compte
              ou en utilisant nos services, vous acceptez sans réserve les présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">2. Description du service</h2>
            <p>
              Réservia Bénin est une plateforme de mise en relation permettant aux utilisateurs de découvrir,
              comparer et réserver des hébergements et des événements au Bénin. Réservia Bénin agit en qualité
              d'intermédiaire entre les voyageurs et les prestataires (hôtels, maisons d'hôtes, organisateurs d'événements).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">3. Création de compte</h2>
            <p>
              Pour accéder aux fonctionnalités de réservation, vous devez créer un compte en fournissant des informations
              exactes, complètes et à jour. Vous êtes responsable de la confidentialité de vos identifiants et de toute
              activité effectuée depuis votre compte.
            </p>
            <p className="mt-2">
              Réservia Bénin se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">4. Réservations</h2>
            <p>
              Toute réservation effectuée via la plateforme constitue un engagement ferme de l'utilisateur. En validant
              une réservation, vous acceptez les conditions tarifaires et les politiques d'annulation du prestataire concerné.
            </p>
            <p className="mt-2">
              Réservia Bénin n'est pas partie au contrat conclu entre l'utilisateur et le prestataire. Elle facilite
              uniquement la mise en relation et le paiement sécurisé.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">5. Paiements</h2>
            <p>
              Les paiements sont traités de manière sécurisée via MTN MoMo, Moov Money ou carte bancaire (Visa/Mastercard).
              Les montants affichés sont en Franc CFA (XOF). Réservia Bénin se réserve le droit de modifier les tarifs
              de commission à tout moment, avec notification préalable aux partenaires.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">6. Annulations et remboursements</h2>
            <p>
              Les conditions d'annulation et de remboursement sont définies par chaque prestataire. Elles sont
              communiquées lors de la réservation. En cas de litige, Réservia Bénin peut intervenir en tant que
              médiateur, sans garantir le résultat de la médiation.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">7. Comportement de l'utilisateur</h2>
            <p>L'utilisateur s'engage à :</p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>Ne pas utiliser la plateforme à des fins illégales ou frauduleuses</li>
              <li>Ne pas tenter de contourner les systèmes de sécurité</li>
              <li>Ne pas publier de contenu offensant, diffamatoire ou protégé par des droits tiers</li>
              <li>Respecter les autres utilisateurs et les prestataires</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">8. Responsabilité</h2>
            <p>
              Réservia Bénin s'efforce d'assurer la disponibilité de la plateforme mais ne peut être tenu responsable
              des interruptions de service, erreurs techniques, ou pertes de données indépendantes de sa volonté.
              La responsabilité de Réservia Bénin est limitée au montant des commissions perçues sur la réservation en cause.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">9. Modification des CGU</h2>
            <p>
              Réservia Bénin se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
              informés des modifications par e-mail ou notification sur la plateforme. La poursuite de l'utilisation
              du service vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU, contactez-nous à{' '}
              <a href="mailto:contact@reservia-benin.com" className="text-terracotta hover:underline">
                contact@reservia-benin.com
              </a>{' '}
              ou consultez nos{' '}
              <Link to="/mentions-legales" className="text-terracotta hover:underline">mentions légales</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
