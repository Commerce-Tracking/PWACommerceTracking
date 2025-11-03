# Script pour Générer les Icônes PWA

## Option 1 : Utiliser une image en ligne

Vous pouvez créer les icônes PWA en utilisant un générateur en ligne :

### 1. PWA Builder Image Generator

- Allez sur : https://www.pwabuilder.com/imageGenerator
- Téléchargez votre logo
- Générez les icônes 192x192 et 512x512
- Placez-les dans `public/icons/`

### 2. RealFaviconGenerator

- Allez sur : https://realfavicongenerator.net/
- Téléchargez votre logo
- Configurez les icônes
- Téléchargez le package complet

### 3. AppIcon.co

- Allez sur : https://www.appicon.co/
- Téléchargez votre logo
- Sélectionnez PWA
- Générez et téléchargez

## Option 2 : Créer manuellement

Si vous avez un logo existant, vous pouvez créer les icônes manuellement :

```bash
# Utiliser ImageMagick (si installé)
convert logo.png -resize 192x192 public/icons/pwa-192x192.png
convert logo.png -resize 512x512 public/icons/pwa-512x512.png

# Utiliser FFmpeg (si installé)
ffmpeg -i logo.png -vf scale=192:192 public/icons/pwa-192x192.png
ffmpeg -i logo.png -vf scale=512:512 public/icons/pwa-512x512.png
```

## Option 3 : Icônes temporaires (pour tester)

Pour tester rapidement, vous pouvez créer des icônes temporaires simples :

1. Créez un fichier SVG simple dans `public/icons/logo.svg`
2. Utilisez un convertisseur en ligne pour générer les PNG
3. Ou créez des PNG de 192x192 et 512x512 avec un fond coloré

## Format requis

- **pwa-192x192.png** : 192x192 pixels, format PNG
- **pwa-512x512.png** : 512x512 pixels, format PNG
- **Couleur de fond** : Recommandé #00277F (votre couleur principale)
- **Transparence** : Optionnelle mais recommandée

## Emplacement

Placez les icônes dans :

```
public/icons/pwa-192x192.png
public/icons/pwa-512x512.png
```
