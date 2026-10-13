export const metadata = {
  title: 'Politique de confidentialité - E-Outilles',
  description: 'Politique de confidentialité et protection des données personnelles',
}

const DPO_EMAIL = 'dpo@e-outilles.com'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Politique de confidentialité</h1>

        <div className="bg-ingco-gray rounded-2xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est E-Outilles by ELECTRON.
              Pour toute question relative à vos données, contactez notre délégué à la protection des
              données : {DPO_EMAIL}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Données collectées</h2>
            <p>E-Outilles collecte les données personnelles suivantes :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de livraison (rue, ville, pays)</li>
              <li>Historique de commandes</li>
              <li>Données de navigation (adresse IP, pages consultées, cookies techniques)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Finalités et bases légales</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Traiter et livrer vos commandes (exécution du contrat)</li>
              <li>Vous informer de l&apos;avancement de vos commandes (exécution du contrat)</li>
              <li>Envoyer notre newsletter (votre consentement, révocable à tout moment)</li>
              <li>Améliorer nos services et prévenir la fraude (intérêt légitime)</li>
              <li>Respecter nos obligations comptables et légales (obligation légale)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Destinataires et sous-traitants</h2>
            <p>
              Vos données ne sont jamais vendues. Elles peuvent être transmises à des prestataires
              strictement nécessaires au service :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Prestataire de paiement (Stripe) pour les transactions par carte</li>
              <li>Transporteurs et partenaires logistiques pour la livraison</li>
              <li>Service d&apos;envoi d&apos;emails transactionnels (Resend)</li>
              <li>Hébergeur du site (Vercel)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Durée de conservation</h2>
            <p>
              Vos données sont conservées 3 ans à compter de votre dernière activité. Les documents et
              pièces comptables liés aux commandes sont conservés 10 ans conformément aux obligations
              légales. Les données bancaires ne sont jamais stockées sur nos serveurs : elles sont
              traitées directement par notre prestataire de paiement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des
              droits suivants :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données</li>
              <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la limitation</strong> : restreindre un traitement</li>
              <li><strong>Droit d&apos;opposition</strong> : vous opposer à un traitement</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, écrivez à {DPO_EMAIL}. Vous pouvez également introduire une
              réclamation auprès de l&apos;autorité de protection des données compétente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
            <p>
              Ce site utilise des cookies pour améliorer votre expérience ainsi qu&apos;un stockage
              local (panier, favoris, session). Les cookies non essentiels ne sont déposés qu&apos;avec
              votre consentement, que vous pouvez accepter ou refuser via le bandeau prévu à cet effet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour
              protéger vos données (chiffrement des mots de passe, connexions sécurisées, accès
              restreint aux administrateurs).
            </p>
          </section>
        </div>

        <p className="text-gray-500 mt-8 text-center">
          Dernière mise à jour : Octobre 2026
        </p>
      </div>
    </div>
  )
}
