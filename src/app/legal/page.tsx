export const metadata = {
  title: 'Mentions légales - E-Outilles',
  description: 'Mentions légales du site E-Outilles',
}

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
            <p>Email : contact@e-outilles.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <p className="mt-2">Vercel Inc.</p>
            <p>440 N Barranca Ave #4133</p>
            <p>Covina, CA 91723, USA</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Propriété intellectuelle</h2>
            <p>Tous les contenus présents sur ce site (textes, images, logos, vidéos) sont protégés par le droit d'auteur et le droit de la propriété intellectuelle.</p>
            <p className="mt-2">Toute reproduction, distribution, modification ou utilisation de ces éléments sans autorisation préalable est interdite.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Responsabilité</h2>
            <p>E-Outilles s'efforce de fournir des informations exactes et à jour sur ce site. Cependant, des erreurs ou omissions peuvent survenir.</p>
            <p className="mt-2">E-Outilles ne pourra être tenu responsable de l'utilisation qui pourrait être faite des informations contenues sur ce site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Liens externes</h2>
            <p>Ce site peut contenir des liens vers des sites externes. E-Outilles n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Droit applicable</h2>
            <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </section>
        </div>

        <p className="text-gray-500 mt-8 text-center">
          © 2026 E-Outilles. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
