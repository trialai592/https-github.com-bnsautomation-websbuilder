import { SiteConfig, SiteSectionType } from "@/types/site-config";

interface BuildSiteConfigInput {
  businessName: string;
  slug: string;
  plannerResult: {
    themeKey: string;
    seo: {
      title: string;
      description: string;
    };
  };
  copyResult: {
    sections: {
      type: string;
      data: Record<string, unknown>;
    }[];
  };
}

const allowedSectionTypes: SiteSectionType[] = [
  "hero",
  "services",
  "benefits",
  "testimonials",
  "faq",
  "contactCta",
  "footer"
];

export function buildSiteConfig(input: BuildSiteConfigInput): SiteConfig {
  return {
    businessName: input.businessName,
    slug: input.slug,
    themeKey: input.plannerResult.themeKey,
    seo: {
      title: input.plannerResult.seo.title,
      description: input.plannerResult.seo.description,
    },
    pages: {
      home: {
        sections: input.copyResult.sections
          .filter((section): section is { type: SiteSectionType; data: Record<string, unknown> } =>
            allowedSectionTypes.includes(section.type as SiteSectionType)
          )
          .map((section, index) => ({
            id: `${section.type}-${index + 1}`,
            type: section.type,
            data: section.data
          })),
      },
    },
  };
}
