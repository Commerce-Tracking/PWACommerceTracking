# 🔧 Guide de Dépannage - Installation PWA

## Problème : Le bouton d'installation n'apparaît pas

### ✅ Critères requis pour l'installation PWA

Le navigateur doit remplir **TOUS** ces critères pour permettre l'installation :

1. ✅ **HTTPS requis** (ou localhost en développement)
2. ✅ **Manifest valide** et accessible
3. ✅ **Service Worker actif**
4. ✅ **Icônes PWA présentes** (192x192 et 512x512)
5. ✅ **Site visité au moins 2 fois** (critère Chrome/Edge)
6. ✅ **Pas déjà installé** sur l'appareil

### 🔍 Diagnostic étape par étape

#### 1. Vérifier le manifest

Ouvrez la console (F12) et tapez :

```javascript
fetch("/manifest.webmanifest")
  .then((r) => r.json())
  .then(console.log);
```

**Résultat attendu** : Un objet JSON avec les informations de l'app

**Si erreur 404** : Le manifest n'est pas généré. Vérifiez `vite.config.ts`

#### 2. Vérifier le Service Worker

1. Ouvrez DevTools (F12)
2. Allez dans **Application** > **Service Workers**
3. Vérifiez que le Service Worker est **"actif et en cours d'exécution"**

**Si pas de Service Worker** :

- Rebuild l'application : `npm run build`
- Rechargez la page plusieurs fois

#### 3. Vérifier les icônes

1. Ouvrez DevTools (F12)
2. Allez dans **Application** > **Manifest**
3. Vérifiez les icônes :
   - ✅ `pwa-192x192.png` (pas d'erreur 404)
   - ✅ `pwa-512x512.png` (pas d'erreur 404)

**Si erreur 404** : Les icônes n'existent pas. Exécutez : `npm run generate-pwa-icons`

#### 4. Vérifier dans la console

Ouvrez la console (F12) et cherchez les logs :

- `PWA: Événement beforeinstallprompt détecté !` → ✅ Tout va bien
- `PWA Install Button - isInstallable: false` → ⚠️ Pas encore installable

#### 5. Vérifier HTTPS

**En développement** : `http://localhost` fonctionne
**En production** : **HTTPS obligatoire**

### 📱 Installation sur Mobile

Sur mobile, l'installation peut fonctionner différemment :

#### Android (Chrome)

1. Ouvrez l'app dans Chrome
2. Menu (3 points) > **"Ajouter à l'écran d'accueil"**
3. Ou notification automatique si les critères sont remplis

#### iOS (Safari)

1. Ouvrez l'app dans Safari
2. Bouton partage (carré avec flèche)
3. **"Sur l'écran d'accueil"**

### 🖥️ Installation sur Desktop

#### Chrome/Edge

1. **Icône dans la barre d'adresse** (à droite de l'URL) si installable
2. Cliquez sur l'icône → **"Installer"**
3. Ou utilisez le bouton dans le header de l'app

#### Firefox

Firefox ne supporte pas l'installation PWA de la même manière.

### 🔧 Solutions rapides

#### Solution 1 : Rebuild l'application

```bash
npm run build
npm run preview
```

Puis testez sur `http://localhost:4173`

#### Solution 2 : Vider le cache

1. DevTools (F12) > **Application**
2. **Clear storage** > **Clear site data**
3. Rechargez la page

#### Solution 3 : Vérifier les logs console

Ouvrez la console et cherchez :

- Messages "PWA: ..."
- Erreurs liées au manifest
- Erreurs liées au Service Worker

### ✅ Checklist de vérification

- [ ] Manifest accessible (`/manifest.webmanifest`)
- [ ] Service Worker actif
- [ ] Icônes PWA créées (`public/icons/pwa-*.png`)
- [ ] HTTPS (ou localhost)
- [ ] Site visité au moins 2 fois
- [ ] Pas déjà installé
- [ ] Console ne montre pas d'erreurs PWA

### 🐛 Problèmes courants

#### "Manifest non trouvé"

→ Le build n'a pas généré le manifest. Rebuild : `npm run build`

#### "Service Worker non enregistré"

→ Vérifiez la configuration dans `vite.config.ts`. Le Service Worker se génère seulement en build.

#### "Icônes 404"

→ Les icônes n'existent pas. Exécutez : `npm run generate-pwa-icons`

#### "beforeinstallprompt jamais déclenché"

→ L'app ne remplit pas tous les critères PWA. Vérifiez la checklist ci-dessus.

### 📝 Note importante

**Le bouton d'installation apparaît seulement quand :**

1. Tous les critères PWA sont remplis
2. Le navigateur détecte que l'app est installable
3. L'événement `beforeinstallprompt` est déclenché

**Cela peut prendre quelques secondes** après le chargement de la page !

### 🔍 Vérification manuelle

Pour forcer la vérification, ouvrez la console et tapez :

```javascript
// Vérifier le manifest
fetch("/manifest.webmanifest")
  .then((r) => r.json())
  .then(console.log);

// Vérifier le Service Worker
navigator.serviceWorker.getRegistration().then(console.log);

// Vérifier si installable
// (l'événement beforeinstallprompt doit être déclenché par le navigateur)
```
