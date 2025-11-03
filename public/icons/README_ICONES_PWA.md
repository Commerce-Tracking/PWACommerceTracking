# ⚠️ Icons PWA Manquantes

## Problème

Les icônes PWA sont nécessaires pour que l'application soit installable. Sans ces icônes, le bouton d'installation n'apparaîtra pas.

## Solution Rapide (5 minutes)

### Option 1 : Utiliser un générateur en ligne (RECOMMANDÉ)

1. **Allez sur** : https://www.pwabuilder.com/imageGenerator
2. **Téléchargez** votre logo (ou utilisez un logo temporaire)
3. **Générez** les icônes 192x192 et 512x512
4. **Placez-les** dans ce dossier (`public/icons/`) :
   - `pwa-192x192.png`
   - `pwa-512x512.png`

### Option 2 : Créer des icônes temporaires avec votre logo

Si vous avez déjà un logo :

1. **Avec ImageMagick** :

   ```bash
   convert logo.png -resize 192x192 public/icons/pwa-192x192.png
   convert logo.png -resize 512x512 public/icons/pwa-512x512.png
   ```

2. **Avec n'importe quel éditeur d'images** :
   - Ouvrez votre logo
   - Redimensionnez à 192x192 pixels → Sauvegardez comme `pwa-192x192.png`
   - Redimensionnez à 512x512 pixels → Sauvegardez comme `pwa-512x512.png`
   - Placez les deux fichiers dans `public/icons/`

### Option 3 : Utiliser le favicon existant

Si vous avez un favicon :

1. Copiez `public/favicon.png` ou votre logo
2. Redimensionnez-le à 192x192 et 512x512
3. Placez-les dans `public/icons/`

## Format requis

- **Format** : PNG
- **Taille** : 192x192 pixels (exactement)
- **Taille** : 512x512 pixels (exactement)
- **Couleur de fond** : Recommandé #00277F (votre couleur principale)
- **Transparence** : Optionnelle

## Après avoir créé les icônes

1. Redémarrez le serveur de développement (`npm run dev`)
2. Rechargez la page
3. Le bouton "Installer l'application" devrait apparaître dans le header
4. Si vous êtes en HTTPS (ou localhost), l'icône d'installation apparaîtra aussi dans la barre d'adresse du navigateur

## Vérification

Après avoir ajouté les icônes :

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Application"
3. Cliquez sur "Manifest" dans le menu de gauche
4. Vérifiez que les icônes sont bien chargées (pas d'erreur 404)

## ⚠️ Important

Sans ces icônes, **la PWA ne sera pas installable**. Créez-les maintenant pour activer l'installation !
