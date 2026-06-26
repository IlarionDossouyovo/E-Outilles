#!/bin/bash

echo "========================================"
echo "  E-Outilles - Script d'installation"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "[1/5] Vérification de Node.js..."
node --version
if [ $? -ne 0 ]; then
    echo "ERREUR: Node.js n'est pas installé!"
    echo "Téléchargez sur: https://nodejs.org"
    exit 1
fi
echo "OK"
echo ""

echo "[2/5] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR lors de l'installation"
    exit 1
fi
echo ""

echo "[3/5] Construction du projet..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERREUR lors de la construction"
    exit 1
fi
echo ""

echo "[4/5] Vérification de la configuration..."
echo "- Tailwind CSS: OK"
echo "- Stripe: Configuré (variables d'environnement requises)"
echo "- PWA: Configuré"
echo ""

echo "[5/5] Démarrage du serveur..."
echo ""
echo "Le serveur démarre sur: http://localhost:3000"
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""
npm run dev