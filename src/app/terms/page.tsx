export const metadata = {
  title: 'Conditions générales de vente - E-Outilles',
  description: 'Conditions générales de vente E-Outilles',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Conditions Générales de Vente</h1>
        
        <div className="bg-ingco-gray rounded-2xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
            <p>Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les relations contractuelles entre E-Outilles et ses clients dans le cadre de la vente d'outils professionnels.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Commandes</h2>
            <p>Toute commande passée sur le site implique l'acceptation pleine et entière des présentes conditions générales de vente. La commande sera confirmée par un email automatique.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Prix</h2>
            <p>Les prix sont indiqués en euros (€) et comprennent la TVA. Les frais de livraison sont ajoutés au moment du checkout.</p>
            <p className="mt-2">E-Outilles se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix affiché au moment de la commande sera le prix applicable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Paiement</h2>
            <p>Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard) ou via les moyens de paiement locaux (MTN Mobile Money, Orange Money).</p>
            <p className="mt-2">La commande sera expéditionnée après réception du paiement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Livraison</h2>
            <p>Les livraisons sont effectuées dans un délai de 5 à 15 jours ouvrés selon la destination. Les frais de livraison varient selon le poids et la destination.</p>
            <p className="mt-2">E-Outilles ne pourra être tenu responsable des retards dus aux transporteurs ou aux douanes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Retractation</h2>
            <p>Conformément à la loi, vous disposez d'un délai de 14 jours à compter de la réception pour exercer votre droit de rétractation sans justification.</p>
            <p className="mt-2">Les frais de retour seront à votre charge.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Garanties</h2>
            <p>Tous nos produits bénéficient de la garantie constructeur. La durée de garantie varie selon les produits (1 à 5 ans).</p>
            <p className="mt-2">En cas de défaut, contactez notre service après-vente.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Service client</h2>
            <p>Pour toute question ou réclamation :</p>
            <p className="mt-2">Email : support@e-outilles.com</p>
            <p>WhatsApp : +33 1 23 45 67 89</p>
          </section>
        </div>

        <p className="text-gray-500 mt-8 text-center">
          © 2026 E-Outilles. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
