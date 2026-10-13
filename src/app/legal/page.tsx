export const metadata = {
  title: 'Mentions légales - E-Outilles',
  description: 'Mentions légales du site E-Outilles',
}

const CONTACT_EMAIL = 'contact@e-outilles.com'
const WHATSAPP = '+229 01 977 003 47'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Mentions légales</h1>

        <div className="bg-ingco-gray rounded-2xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du site</h2>
            <p>Le site E-Outilles est édité par :</p>
            <p className="mt-2">E-Outilles by ELECTRON</p>
            <p>Boutique en ligne d&apos;outillage professionnel INGCO et d&apos;équipements industriels.</p>
            <p>Marché principal : Afrique de l&apos;Ouest (Bénin, Côte d&apos;Ivoire, Togo, Sénégal).</p>
            <p className="mt-2">Email : {CONTACT_EMAIL}</p>
            <p>WhatsApp : {WHATSAPP}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Responsable de la publication</h2>
            <p>Le responsable de la publication est le représentant légal d&apos;E-Outilles by ELECTRON.</p>
            <p className="mt-2">Contact : {CONTACT_EMAIL}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <p className="mt-2">Vercel Inc.</p>
            <p>440 N Barranca Ave #4133</p>
            <p>Covina, CA 91723, USA</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Propriété intellectuelle</h2>
            <p>
              Tous les contenus présents sur ce site (textes, images, logos, vidéos, base de données)
              sont protégés par le droit d&apos;auteur et le droit de la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, distribution, modification ou utilisation de ces éléments sans
              autorisation préalable est interdite. Les marques et logos INGCO appartiennent à leurs
              détenteurs respectifs et sont utilisés dans le cadre de la distribution de leurs produits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Données personnelles et cookies</h2>
            <p>
              Le traitement des données personnelles est décrit dans notre{' '}
              <a href="/privacy" className="text-ingco-yellow hover:underline">
                politique de confidentialité
              </a>
              . Le site utilise des cookies pour assurer son fonctionnement et améliorer votre
              expérience ; vous pouvez gérer vos préférences via le bandeau de consentement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Responsabilité et liens externes</h2>
            <p>
              E-Outilles s&apos;efforce de fournir des informations exactes et à jour. Des erreurs ou
              omissions peuvent toutefois survenir, sans que la responsabilité d&apos;E-Outilles puisse
              être engagée.
            </p>
            <p className="mt-2">
              Ce site peut contenir des liens vers des sites externes. E-Outilles n&apos;exerce aucun
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit applicable au lieu
              d&apos;établissement de l&apos;éditeur. En cas de litige, une solution amiable sera
              recherchée en priorité avant toute action contentieuse.
            </p>
          </section>
        </div>

        <p className="text-gray-500 mt-8 text-center">
          © 2026 E-Outilles. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
