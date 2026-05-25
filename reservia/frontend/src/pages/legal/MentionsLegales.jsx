import { Link } from 'react-router-dom'

export default function MentionsLegales() {
  return (
    <div className="min-h-screen pt-16 bg-sand">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14">

        <div className="mb-10">
          <Link to="/" className="text-terracotta text-sm hover:underline">← Retour à l'accueil</Link>
          <h1 className="font-display text-3xl text-dark mt-4 mb-2">Mentions légales</h1>
          <p className="text-earth text-sm">Dernière mise à jour : mai 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8 text-dark/80 leading-relaxed">

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">1. Éditeur du site</h2>
            <p>Le site <strong>Réservia Bénin</strong> est édité par :</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>Raison sociale :</strong> Réservia Bénin</li>
              <li><strong>Adresse :</strong> Haie Vive, Cotonou, République du Bénin</li>
              <li><strong>E-mail :</strong> contact@reservia-benin.com</li>
              <li><strong>Téléphone :</strong> +229 61 00 00 00</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">2. Directeur de la publication</h2>
            <p>Le directeur de la publication est le représentant légal de Réservia Bénin.</p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">3. Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>Frontend :</strong> Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</li>
              <li><strong>Backend :</strong> Railway Corp., San Francisco, CA, USA</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, logos, icônes, structure) est la propriété exclusive de
              Réservia Bénin, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation
              préalable écrite est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">5. Limitation de responsabilité</h2>
            <p>
              Réservia Bénin s'efforce de fournir des informations exactes et à jour. Cependant, la plateforme ne peut
              garantir l'exactitude, la complétude ou l'actualité des informations publiées par les partenaires
              (établissements, organisateurs d'événements). L'utilisateur est invité à vérifier les informations
              directement auprès des prestataires.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">6. Données personnelles</h2>
            <p>
              Les informations relatives au traitement des données personnelles sont détaillées dans notre{' '}
              <Link to="/confidentialite" className="text-terracotta hover:underline">politique de confidentialité</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-dark text-lg mb-3">7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit béninois. En cas de litige, les tribunaux
              compétents de Cotonou, République du Bénin, sont seuls compétents.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
