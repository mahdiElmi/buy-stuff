import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/products/add", "/product/*/edit", "/checkout"],
    },
    // sitemap: 'https://acme.com/sitemap.xml',
  };
}
