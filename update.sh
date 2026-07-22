#!/bin/bash
# ============================================
#  E-Outilles - Script de Mise à Jour
# ============================================

echo "🚀 Mise à jour E-Outilles..."

# 1. Mettre à jour les dépendances
echo "📦 Installation des dépendances..."
npm install

# 2. Générer le client Prisma
echo "🗄️ Génération Prisma..."
npx prisma generate

# 3. Mettre à jour la base de données (si nécessaire)
echo "🔄 Migration base de données..."
npx prisma db push

# 4. Re-générer (build)
echo "🏗️ Build du projet..."
npm run build

# 5. Redémarrer le serveur
echo "✅ Terminé!"
echo ""
echo "Pour lancer le serveur: npm run dev"
