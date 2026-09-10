import { useEffect } from "react";

function SEO({
  title,
  description,
  image,
  url,
  noindex = false,
}) {
  useEffect(() => {
    // Titre de la page
    if (title) {
      document.title = title;
    }

    // Fonction pour créer ou modifier une balise meta
    const setMeta = (name, content, attribute = "name") => {
      if (!content) return;

      let element = document.head.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Description SEO
    setMeta("description", description);

    // Gestion de l'indexation Google
    setMeta(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow"
    );

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");

    if (image) {
      setMeta("og:image", image, "property");
    }

    if (url) {
      setMeta("og:url", url, "property");
    }

    setMeta("og:type", "website", "property");

    // Twitter / X
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    if (image) {
      setMeta("twitter:image", image);
    }

    // URL canonique
    if (url) {
      let canonical = document.head.querySelector(
        'link[rel="canonical"]'
      );

      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }

      canonical.setAttribute("href", url);
    }

  }, [title, description, image, url, noindex]);

  return null;
}

export default SEO;