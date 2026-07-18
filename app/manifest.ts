import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Roundtable",
    short_name: "Roundtable",
    description: "One question. Multiple AI experts. Better decisions.",
    start_url: "/",
    display: "standalone",
    background_color: "#070912",
    theme_color: "#070912",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
