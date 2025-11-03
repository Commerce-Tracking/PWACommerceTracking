# Guide de Configuration PWA

## 🚀 Configuration PWA Complète

Cette application est configurée comme **Progressive Web App (PWA)** pour fonctionner hors ligne et être installable sur les appareils mobiles et desktop.

## 📋 Prérequis

1. **Icônes PWA** : Vous devez créer les icônes suivantes dans `public/icons/` :
   - `pwa-192x192.png` (192x192 pixels)
   - `pwa-512x512.png` (512x512 pixels)

### Génération des icônes

Vous pouvez générer ces icônes à partir de votre logo en utilisant :

- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [AppIcon.co](https://www.appicon.co/)

**Note** : Si vous n'avez pas encore les icônes, créez des placeholders temporaires pour tester.

## ✨ Fonctionnalités PWA Implémentées

### 1. **Installation de l'Application**

- Les utilisateurs peuvent installer l'app sur leur écran d'accueil
- Fonctionne sur mobile (Android/iOS) et desktop (Chrome/Edge)

### 2. **Mode Hors Ligne**

- L'application fonctionne sans connexion internet
- Les données sont mises en cache automatiquement
- Synchronisation automatique quand la connexion revient

### 3. **Mises à Jour Automatiques**

- Détection automatique des nouvelles versions
- Notification pour mettre à jour l'application
- Installation des mises à jour sans perdre les données

### 4. **Optimisation des Performances**

- Cache intelligent des ressources statiques
- Cache des images (30 jours)
- Cache des API calls (24 heures)
- Cache des ressources JavaScript/CSS (7 jours)

## 🛠️ Stratégies de Cache

### API Calls

- **Stratégie** : NetworkFirst
- **Durée** : 24 heures
- **Timeout** : 10 secondes
- Si pas de connexion, utilise les données en cache

### Images

- **Stratégie** : CacheFirst
- **Durée** : 30 jours
- Les images sont mises en cache en priorité

### Ressources Statiques (JS/CSS)

- **Stratégie** : StaleWhileRevalidate
- **Durée** : 7 jours
- Met à jour en arrière-plan sans bloquer le chargement

## 📱 Installation

### Sur Mobile (Android/iOS)

1. Ouvrir l'application dans Chrome/Safari
2. Voir l'invitation d'installation
3. Appuyer sur "Installer" ou "Ajouter à l'écran d'accueil"
4. L'application apparaît comme une app native

### Sur Desktop (Chrome/Edge)

1. Ouvrir l'application dans le navigateur
2. Voir l'icône d'installation dans la barre d'adresse
3. Cliquer sur "Installer"
4. L'application s'ouvre dans une fenêtre dédiée

## 🔧 Configuration

### Fichier `vite.config.ts`

La configuration PWA est dans le fichier `vite.config.ts` :

- **registerType** : `"prompt"` - Demande la permission avant l'installation
- **strategies** : `"generateSW"` - Génération automatique du Service Worker
- **Runtime Caching** : Configuration des stratégies de cache

### Composants PWA

- **`PWAUpdatePrompt`** : Gère les mises à jour de l'application
- **`OfflineIndicator`** : Affiche l'indicateur de mode hors ligne
- **`PWAInstallButton`** : Bouton pour installer l'application
- **`usePWAInstall`** : Hook pour gérer l'installation

## 🧪 Tests

### Tester le Mode Hors Ligne

1. Ouvrir l'application
2. Ouvrir les DevTools (F12)
3. Aller dans l'onglet "Network"
4. Cocher "Offline"
5. Rafraîchir la page
6. L'application devrait fonctionner normalement

### Tester l'Installation

1. Ouvrir l'application dans Chrome/Edge
2. Vérifier l'icône d'installation dans la barre d'adresse
3. Cliquer sur "Installer"
4. L'application devrait s'ouvrir dans une fenêtre dédiée

### Tester les Mises à Jour

1. Faire une modification dans le code
2. Rebuild l'application (`npm run build`)
3. Recharger l'application
4. Voir la notification de mise à jour

## 📊 Monitoring

### Vérifier le Service Worker

1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Application"
3. Cliquer sur "Service Workers"
4. Voir le statut du Service Worker

### Vérifier le Cache

1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Application"
3. Cliquer sur "Cache Storage"
4. Voir les différents caches (api-cache, images-cache, static-resources)

## 🐛 Dépannage

### Le Service Worker ne se charge pas

1. Vérifier que vous êtes en HTTPS (ou localhost en développement)
2. Vider le cache du navigateur
3. Désinstaller et réinstaller l'application
4. Vérifier la console pour les erreurs

### Les mises à jour ne fonctionnent pas

1. Vérifier que `registerType` est `"prompt"` ou `"autoUpdate"`
2. Vérifier que le Service Worker est enregistré
3. Forcer la mise à jour : Vider le cache et rafraîchir

### L'application ne fonctionne pas hors ligne

1. Vérifier que le Service Worker est actif
2. Vérifier les stratégies de cache dans `vite.config.ts`
3. Vérifier que les ressources sont bien mises en cache

## 📚 Ressources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

## 🎯 Prochaines Étapes

1. ✅ Configuration PWA de base
2. ✅ Service Worker avec stratégies de cache
3. ✅ Composants PWA (Install, Update, Offline)
4. ⏳ Icônes PWA (à créer)
5. ⏳ Synchronisation en arrière-plan (Background Sync)
6. ⏳ Notifications Push (si nécessaire)

## 💡 Notes Importantes

- **HTTPS requis** : Les PWA nécessitent HTTPS en production (ou localhost en dev)
- **Icônes obligatoires** : Créez les icônes avant de déployer en production
- **Service Worker** : Généré automatiquement par Vite PWA Plugin
- **Cache** : Les données sont mises en cache automatiquement selon les stratégies configurées
