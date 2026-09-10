import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("properties").get();

    const staticUrls = [
      "https://logement221.vercel.app/",
      "https://logement221.vercel.app/logements",
      "https://logement221.vercel.app/publier",
      "https://logement221.vercel.app/a-propos",
      "https://logement221.vercel.app/contact",
    ];

    const propertyUrls = snapshot.docs.map(
      (doc) =>
        `https://logement221.vercel.app/property/${doc.id}`
    );

    const urls = [...staticUrls, ...propertyUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    return res.status(200).send(xml);
  } catch (error) {
    console.error("Erreur génération sitemap :", error);

    return res.status(500).send("Erreur génération sitemap");
  }
}