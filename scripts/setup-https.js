// Script pour générer des certificats SSL auto-signés pour HTTPS en développement
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certsDir = path.join(__dirname, "..", "certs");

async function generateCertificates() {
  try {
    // Créer le dossier certs s'il n'existe pas
    if (!fs.existsSync(certsDir)) {
      fs.mkdirSync(certsDir, { recursive: true });
      console.log("✅ Dossier certs créé");
    }

    console.log("🔐 Génération des certificats SSL auto-signés...");
    console.log(
      "⚠️  Ces certificats sont uniquement pour le développement local"
    );

    // Générer une clé privée
    const keyPath = path.join(certsDir, "key.pem");
    const certPath = path.join(certsDir, "cert.pem");

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      const command = `openssl req -x509 -newkey rsa:4096 -nodes -keyout "${keyPath}" -out "${certPath}" -days 365 -subj "/C=FR/ST=State/L=City/O=Organization/CN=localhost"`;

      try {
        await execAsync(command);
        console.log("✅ Certificats SSL générés avec succès !");
        console.log(`📍 Emplacement : ${certsDir}`);
      } catch (error) {
        console.error("❌ Erreur lors de la génération des certificats");
        console.error(
          "💡 Assurez-vous qu'OpenSSL est installé sur votre système"
        );
        console.error(
          "\n📝 Alternatives :\n1. Installez OpenSSL (https://www.openssl.org/)\n2. Ou utilisez mkcert (https://github.com/FiloSottile/mkcert)"
        );
        throw error;
      }
    } else {
      console.log("✅ Certificats SSL déjà présents");
    }
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    process.exit(1);
  }
}

generateCertificates();
