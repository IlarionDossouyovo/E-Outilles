#!/bin/bash
# ============================================
#  E-Outilles - Script de Sauvegarde
# ============================================

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Sauvegarde E-Outilles..."

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarder la base de données
echo "📦 Sauvegarde de la base de données..."
cp prisma/dev.db "$BACKUP_DIR/dev.db.$DATE"

# Sauvegarder le fichier .env
echo "🔐 Sauvegarde des variables d'environnement..."
cp .env "$BACKUP_DIR/.env.$DATE"

# Sauvegarder les logs
echo "📝 Sauvegarde des logs..."
if [ -f server.log ]; then
  cp server.log "$BACKUP_DIR/server.log.$DATE"
fi

# Afficher les sauvegardes
echo ""
echo "✅ Sauvegardes créées:"
ls -lh $BACKUP_DIR

echo ""
echo "💡 Pour restaurer: cp $BACKUP_DIR/dev.db.$DATE prisma/dev.db"
