export type SiteSectionType =
  | "hero"
  | "services"
  | "benefits"
  | "testimonials"
  | "faq"
  | "contactCta"
  | "footer";

export interface SiteSection {
  id: string;
  type: SiteSectionType;
  data: Record<string, unknown>;
}

export interface SiteConfig {
  businessName: string;
  slug: string;
  themeKey: string;
  seo: {
    title: string;
    description: string;
  };
  pages: {
    home: {
      sections: SiteSection[];
    };
  };
}
