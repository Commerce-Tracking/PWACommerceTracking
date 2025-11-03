# 🔒 Configuration HTTPS pour PWA en Réseau

## Problème

Les PWA nécessitent **HTTPS** pour fonctionner sur le réseau (pas seulement `localhost`).

## Solution Rapide avec mkcert

### 1. Installer mkcert

**Windows (PowerShell en Admin) :**

```powershell
# Via Chocolatey
choco install mkcert

# Ou téléchargez depuis : https://github.com/FiloSottile/mkcert/releases
```

### 2. Trouver votre IP locale

```powershell
ipconfig
# Notez votre "IPv4 Address" (ex: 192.168.1.100)
```

### 3. Générer les certificats

```powershell
# Installer la CA locale
mkcert -install

# Générer les certificats (remplacez 192.168.1.100 par votre IP)
mkcert localhost 127.0.0.1 192.168.1.100
```

### 4. Organiser les certificats

```powershell
# Créer le dossier certs
mkdir certs

# Déplacer les fichiers générés
move localhost+2.pem certs\cert.pem
move localhost+2-key.pem certs\key.pem
```

### 5. Démarrer le serveur

```powershell
npm run dev
```

Le serveur détectera automatiquement les certificats et démarrera en HTTPS.

### 6. Accéder en HTTPS

- `https://192.168.1.100:5174` (remplacez par votre IP)
- Le banner PWA devrait maintenant apparaître !

## Vérification

1. Ouvrez la console (F12)
2. Vérifiez que vous voyez :
   - ✅ `PWA: Service Worker actif`
   - ✅ `PWA: Manifest valide trouvé`
   - ✅ Le banner d'installation en bas de l'écran

## Alternative : Certificats auto-signés

Si vous ne pouvez pas utiliser mkcert :

```powershell
npm run setup-https
```

⚠️ Vous devrez accepter l'avertissement de sécurité à chaque fois.

Pour plus de détails, voir `docs/PWA_NETWORK_HTTPS.md`.
