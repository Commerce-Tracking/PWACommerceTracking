# 🔒 Configuration HTTPS pour PWA en Réseau Local

## ⚠️ Problème

Les PWA nécessitent **HTTPS** pour fonctionner, sauf pour `localhost` et `127.0.0.1`.

Quand vous accédez à l'application via une **IP réseau** (ex: `192.168.1.100:5174`), le navigateur **bloque** les fonctionnalités PWA car ce n'est pas en HTTPS.

## ✅ Solutions

### Solution 1 : Utiliser mkcert (RECOMMANDÉ - Plus simple)

`mkcert` crée des certificats SSL valides reconnus par votre navigateur.

#### Installation de mkcert

**Windows :**

```powershell
# Avec Chocolatey
choco install mkcert

# Ou téléchargez depuis : https://github.com/FiloSottile/mkcert/releases
```

**Mac :**

```bash
brew install mkcert
```

**Linux :**

```bash
# Ubuntu/Debian
sudo apt install mkcert

# Ou via snap
sudo snap install mkcert
```

#### Utilisation

1. **Installer la CA locale** :

   ```bash
   mkcert -install
   ```

2. **Générer les certificats** :

   ```bash
   # Remplacer 192.168.1.100 par votre IP locale
   mkcert localhost 127.0.0.1 192.168.1.100
   ```

   Cela génère `localhost+2.pem` et `localhost+2-key.pem`

3. **Renommer et déplacer les certificats** :

   ```bash
   mkdir certs
   mv localhost+2.pem certs/cert.pem
   mv localhost+2-key.pem certs/key.pem
   ```

4. **Modifier `vite.config.ts`** :

   ```typescript
   import fs from "fs";

   export default defineConfig({
     server: {
       host: true,
       https: {
         key: fs.readFileSync("./certs/key.pem"),
         cert: fs.readFileSync("./certs/cert.pem"),
       },
       // ...
     },
   });
   ```

5. **Démarrer le serveur** :

   ```bash
   npm run dev
   ```

6. **Accéder en HTTPS** :
   - `https://192.168.1.100:5174` (remplacer par votre IP)
   - Le navigateur reconnaîtra le certificat comme valide

### Solution 2 : Certificats auto-signés (Plus complexe)

1. **Installer OpenSSL** si pas déjà installé

2. **Générer les certificats** :

   ```bash
   npm run setup-https
   ```

3. **Modifier `vite.config.ts`** :

   ```typescript
   import fs from "fs";

   export default defineConfig({
     server: {
       host: true,
       https: {
         key: fs.readFileSync("./certs/key.pem"),
         cert: fs.readFileSync("./certs/cert.pem"),
       },
     },
   });
   ```

4. **⚠️ Important** : Vous devrez accepter l'avertissement de sécurité dans le navigateur à chaque fois (certificat auto-signé).

### Solution 3 : Reverse Proxy (Production)

Pour la production, utilisez un reverse proxy (Nginx, Apache) avec des certificats SSL valides (Let's Encrypt).

## 🔍 Vérification

Après avoir configuré HTTPS :

1. Accédez à l'application via `https://VOTRE_IP:5174`
2. Ouvrez la console (F12)
3. Vérifiez que vous voyez :
   - ✅ `PWA: Service Worker actif`
   - ✅ `PWA: Manifest valide trouvé`
   - ✅ `PWA: Événement beforeinstallprompt détecté !`

## 📝 Notes

- **En développement local** : `http://localhost:5174` fonctionne sans HTTPS
- **En réseau local** : HTTPS est **obligatoire** pour les PWA
- **En production** : HTTPS est **obligatoire** partout

## 🚀 Commandes Rapides

```bash
# Installer mkcert (une seule fois)
mkcert -install

# Générer les certificats pour votre IP
mkcert localhost 127.0.0.1 192.168.1.100

# Créer le dossier et déplacer les certificats
mkdir certs
mv localhost+2.pem certs/cert.pem
mv localhost+2-key.pem certs/key.pem

# Modifier vite.config.ts (voir ci-dessus)
# Puis démarrer
npm run dev
```

## 💡 Astuce

Pour trouver votre IP locale :

**Windows :**

```powershell
ipconfig
# Cherchez "IPv4 Address" sous votre adaptateur réseau
```

**Mac/Linux :**

```bash
ifconfig
# Ou
ip addr
```
