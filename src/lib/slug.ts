const DEFAULT_FALLBACK = "untitled";
const DEFAULT_MAX_LENGTH = 80;

type SlugOptions = {
  fallback?: string;
  maxLength?: number;
};

type UniqueSlugOptions = SlugOptions & {
  separator?: "-" | "_";
  isTaken: (slug: string) => Promise<boolean>;
};

export function slugify(input: string, options: SlugOptions = {}): string {
  const fallback = (options.fallback ?? DEFAULT_FALLBACK).trim() || DEFAULT_FALLBACK;
  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;

  const normalized = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  const base = normalized || slugify(fallback, { fallback: DEFAULT_FALLBACK, maxLength });
  return base.slice(0, maxLength).replace(/-+$/g, "") || DEFAULT_FALLBACK;
}

export async function generateUniqueSlug(input: string, options: UniqueSlugOptions): Promise<string> {
  const separator = options.separator ?? "-";
  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;
  const baseSlug = slugify(input, { fallback: options.fallback, maxLength });

  if (!(await options.isTaken(baseSlug))) {
    return baseSlug;
  }

  let counter = 2;
  while (counter < Number.MAX_SAFE_INTEGER) {
    const suffix = `${separator}${counter}`;
    const trimmedBase = baseSlug.slice(0, Math.max(1, maxLength - suffix.length)).replace(/[-_]+$/g, "");
    const candidate = `${trimmedBase}${suffix}`;
    if (!(await options.isTaken(candidate))) {
      return candidate;
    }
    counter += 1;
  }

  throw new Error("Unable to generate unique slug");
}
