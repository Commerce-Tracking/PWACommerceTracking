# ⚡ Guide Rapide : Activer HTTPS pour PWA en Réseau

## 🎯 Le Problème

En local (`localhost`), les PWA fonctionnent sans HTTPS.  
Sur le réseau (`192.168.x.x`), **HTTPS est OBLIGATOIRE** pour les PWA.

## ✅ Solution en 3 étapes

### Étape 1 : Installer mkcert

```powershell
# Windows (PowerShell en Admin)
choco install mkcert

# Ou téléchargez depuis : https://github.com/FiloSottile/mkcert/releases
```

### Étape 2 : Générer les certificats

```powershell
# Trouvez votre IP
ipconfig
# Notez votre "IPv4 Address" (ex: 192.168.1.100)

# Installer la CA locale (une seule fois)
mkcert -install

# Générer les certificats (remplacez 192.168.1.100 par votre IP)
mkcert localhost 127.0.0.1 192.168.1.100

# Créer le dossier certs et déplacer les fichiers
mkdir certs
move localhost+2.pem certs\cert.pem
move localhost+2-key.pem certs\key.pem
```

### Étape 3 : Activer HTTPS dans vite.config.ts

Ouvrez `vite.config.ts` et **décommentez/modifiez** ces lignes (vers la ligne 152) :

```typescript
server: {
  host: true,
  https: {
    key: require("fs").readFileSync("./certs/key.pem"),
    cert: require("fs").readFileSync("./certs/cert.pem"),
  },
  // ... reste de la config
}
```

### Étape 4 : Redémarrer

```powershell
npm run dev
```

Accédez maintenant via **`https://VOTRE_IP:5174`** (pas http) !

Le banner d'installation devrait apparaître. ✅
