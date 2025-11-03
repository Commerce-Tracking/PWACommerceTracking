# 🔒 Activer HTTPS pour PWA en Réseau - Guide Rapide

## Pourquoi ?

Les navigateurs **bloquent les PWA en HTTP** sur le réseau (sauf `localhost`).
C'est pour ça que ça marche en local mais pas en réseau !

## ✅ Solution en 4 étapes

### Étape 1 : Installer mkcert

```powershell
# PowerShell en Admin
choco install mkcert
```

### Étape 2 : Trouver votre IP

```powershell
ipconfig
# Notez votre "IPv4 Address" (ex: 192.168.1.100)
```

### Étape 3 : Générer les certificats

```powershell
# Installer la CA (une seule fois)
mkcert -install

# Générer les certificats (remplacez 192.168.1.100 par VOTRE IP)
mkcert localhost 127.0.0.1 192.168.1.100

# Créer le dossier certs
mkdir certs

# Déplacer les fichiers
move localhost+2.pem certs\cert.pem
move localhost+2-key.pem certs\key.pem
```

### Étape 4 : Activer HTTPS dans vite.config.ts

Ouvrez `vite.config.ts` et **décommentez/modifiez** ces lignes (vers ligne 152) :

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

**Ensuite :**

```powershell
npm run dev
```

Accédez maintenant via **`https://VOTRE_IP:5174`** (avec https !)

Le banner d'installation devrait apparaître ! ✅
