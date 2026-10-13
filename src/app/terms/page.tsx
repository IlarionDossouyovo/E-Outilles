export const metadata = {
  title: 'Conditions générales de vente - E-Outilles',
  description: 'Conditions générales de vente E-Outilles',
}

const SUPPORT_EMAIL = 'support@e-outilles.com'
const WHATSAPP = '+229 01 977 003 47'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Conditions Générales de Vente</h1>

        <div className="bg-ingco-gray rounded-2xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
              entre E-Outilles by ELECTRON et ses clients dans le cadre de la vente d&apos;outils
              professionnels et d&apos;équipements industriels sur le site E-Outilles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Commandes</h2>
            <p>
              Toute commande passée sur le site implique l&apos;acceptation pleine et entière des
              présentes CGV. La commande est confirmée par un email automatique récapitulant les
              articles, le montant et l&apos;adresse de livraison.
            </p>
            <p className="mt-2">
              E-Outilles se réserve le droit de refuser ou d&apos;annuler une commande en cas de litige
              antérieur, de suspicion de fraude ou d&apos;indisponibilité d&apos;un produit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Prix</h2>
            <p>
              Les prix sont indiqués en euros (€), toutes taxes comprises. Les frais de livraison sont
              ajoutés au moment du paiement. Le prix applicable est celui affiché au moment de la
              validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Paiement</h2>
            <p>
              Le paiement s&apos;effectue en ligne par carte bancaire (Visa, Mastercard) via notre
              prestataire Stripe, ou via les moyens de paiement locaux (MTN Mobile Money, Moov, Orange
              Money). Le paiement à la livraison peut être proposé selon la zone.
            </p>
            <p className="mt-2">La commande est expédiée après réception et validation du paiement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Livraison</h2>
            <p>
              La livraison est gratuite à Cotonou et s&apos;effectue sous 48 h dans les grandes villes.
              Pour les autres destinations, le délai est de 5 à 15 jours ouvrés. Un suivi est assuré
              par WhatsApp.
            </p>
            <p className="mt-2">
              E-Outilles ne peut être tenu responsable des retards imputables au transporteur ou aux
              formalités douanières.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Droit de rétractation et retours</h2>
            <p>
              Conformément à la réglementation, vous disposez d&apos;un délai de 14 jours à compter de la
              réception pour exercer votre droit de rétractation, sans justification. Les produits
              doivent être retournés neufs, non utilisés et dans leur emballage d&apos;origine.
            </p>
            <p className="mt-2">
              Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou
              d&apos;erreur de notre part.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Garanties</h2>
            <p>
              Tous nos produits bénéficient de la garantie constructeur, d&apos;une durée minimale de
              1 an (jusqu&apos;à 5 ans selon les produits). En cas de défaut, contactez notre service
              après-vente pour une prise en charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Réclamations, médiation et service client</h2>
            <p>Pour toute question ou réclamation :</p>
            <p className="mt-2">Email : {SUPPORT_EMAIL}</p>
            <p>WhatsApp : {WHATSAPP}</p>
            <p className="mt-2">
              En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le client
              peut recourir gratuitement à un médiateur de la consommation ou à l&apos;autorité
              compétente.
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
