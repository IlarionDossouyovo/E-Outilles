export const metadata = {
  title: 'Politique de confidentialité - E-Outilles',
  description: 'Politique de confidentialité et protection des données personnelles',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Politique de confidentialité</h1>
        
        <div className="bg-ingco-gray rounded-2xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Collecte des données</h2>
            <p>E-Outilles collecte les données personnelles suivantes :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de livraison</li>
              <li>Données de navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation des données</h2>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Traitement de vos commandes</li>
              <li>Communication sur vos commandes</li>
              <li>Envoi de notre newsletter (avec votre consentement)</li>
              <li>Amélioration de nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Conservation des données</h2>
            <p>Vos données sont conservées pour une durée de 3 ans à compter de votre dernière activité sur le site. Les données de paiement sont supprimées dès la transaction complétée.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact</h2>
            <p>Pour exercer vos droits ou pour toute question concernant la protection de vos données :</p>
            <p className="mt-2">Email : dpo@e-outilles.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
            <p>Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter ou refuser les cookies non essentiels via notre bandeau de consentement.</p>
          </section>
        </div>

        <p className="text-gray-500 mt-8 text-center">
          Dernière mise à jour : Juillet 2026
        </p>
      </div>
    </div>
  )
}
