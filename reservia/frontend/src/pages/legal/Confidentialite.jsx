import { Link } from 'react-router-dom'

export default function Confidentialite() {
  return (
    <div className="min-h-screen pt-16 bg-sand">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14">

        <div className="mb-10">
          <Link to="/" className="text-terracotta text-sm hover:underline">← Retour à l'accueil</Link>
          <h1 className="font-display text-3xl text-dark mt-4 mb-2">Politique de confidentialité</h1>
          <p className="text-earth text-sm">Dernière mise à jour : mai 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8 text-dark/80 leading-relaxed">

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées sur Réservia Bénin est la société
              Réservia Bénin, dont le siège social est situé à Haie Vive, Cotonou, République du Bénin.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">2. Données collectées</h2>
            <p>Dans le cadre de l'utilisation de la plateforme, nous collectons :</p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>Données d'identification : nom, prénom, adresse e-mail, numéro de téléphone</li>
              <li>Données de connexion : adresse IP, date et heure de connexion, navigateur utilisé</li>
              <li>Données de réservation : hébergements ou événements réservés, dates, montants</li>
              <li>Données de paiement : méthode de paiement choisie (les données bancaires complètes ne sont pas conservées)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Traiter vos réservations et paiements</li>
              <li>Vous envoyer des confirmations et notifications par e-mail</li>
              <li>Améliorer nos services et personnaliser votre expérience</li>
              <li>Respecter nos obligations légales et fiscales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">4. Base légale</h2>
            <p>
              Le traitement de vos données repose sur : l'exécution du contrat (réservations), votre consentement
              (communication marketing), et nos obligations légales.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">5. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant la durée de votre relation contractuelle avec Réservia Bénin,
              augmentée de 3 ans pour les données de réservation, conformément aux obligations comptables et fiscales.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">6. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être transmises aux prestataires
              d'hébergement ou organisateurs d'événements dans le strict cadre de l'exécution de votre réservation,
              ainsi qu'aux prestataires techniques (hébergement, paiement) soumis à des engagements de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">7. Vos droits</h2>
            <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:contact@reservia-benin.com" className="text-terracotta hover:underline">
                contact@reservia-benin.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">8. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
              contre tout accès non autorisé, perte, altération ou divulgation. Les communications entre votre navigateur
              et nos serveurs sont chiffrées via SSL/TLS.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">9. Cookies</h2>
            <p>
              Réservia Bénin utilise des cookies essentiels au fonctionnement de la plateforme (authentification,
              préférences). Aucun cookie publicitaire n'est déposé sans votre consentement.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
