# 📱 Guide - Mettre à Jour E-Outilles sur Votre PC

## 📂 Emplacement du Projet
```
C:\Users\AUGUSTIN\OneDrive\Documents\E-Outille\E-Outilles-main
```

---

## 🚀 Commandes à Exécuter

### 1️⃣ Ouvrir le dossier projet
```powershell
cd "C:\Users\AUGUSTIN\OneDrive\Documents\E-Outille\E-Outilles-main"
```

### 2️⃣ Mettre à jour le projet (une seule commande)
```powershell
.\update.bat
```

Ou si le fichier update.bat n'existe pas, créez-le avec le contenu ci-dessous.

---

## 📝 Créer le fichier update.bat

Créez un fichier nommé `update.bat` dans le dossier du projet avec ce contenu:

```batch
@echo off
echo ===============================
echo   E-Outilles - Mise a jour
echo ===============================

echo.
echo [1/4] Installation des dependances...
call npm install

echo.
echo [2/4] Generation Prisma...
call npx prisma generate

echo.
echo [3/4] Construction du projet...
call npm run build

echo.
echo ===============================
echo   Termine!
echo ===============================
echo.
echo Lancer le serveur: npm run dev
echo Site: http://localhost:3003
echo.
pause
```

---

## ⚡ Commandes Rapides

### Lancer le serveur
```powershell
npm run dev
```

### Voir les mises à jour
```powershell
git pull
```

### Sauvegarder la base de données
```powershell
copy prisma\dev.db backups\dev.db.%date:~0,4%%date:~5,2%%date:~8,2%
```

---

## 🔧 Résolution de Problèmes

### Erreur "port already in use"
```powershell
netstat -ano | findstr :3003
taskkill /PID <NUMERO> /F
```

### Erreur Node.js non trouvé
- Redémarrez votre terminal
- Ou réinstallez Node.js depuis https://nodejs.org

### Erreur .env
```powershell
copy .env.example .env
```
Puis modifiez `.env` avec vos clés API.

---

## 📞 Accès au Site

| Page | URL |
|------|-----|
| **Site** | http://localhost:3003 |
| **Admin** | http://localhost:3003/admin |
| **Contact** | http://localhost:3003/contact |
| **Connexion** | http://localhost:3003/auth/login |

### Identifiants Admin
- **Email:** admin@eoutilles.com
- **Mot de passe:** admin123

---

## 📦 Contenu du Projet

- 32 produits professionnels
- 9 articles blog
- 1 utilisateur admin
- API Resend configurée (emails)
- Stripe (paiements) - nécessite clés

---

## 🔄 Après une modification Git

Si vous faites `git pull` et recevez des mises à jour:
```powershell
npm install
npx prisma generate
npm run build
```

Ou simplement:
```powershell
.\update.bat
```
