import type { WatchLink } from '../types';

const OTT_PROVIDER_NAMES: Record<string, string> = {
  netflix: 'Netflix',
  disneyplus: 'Disney+',
  tving: 'TVING',
  wavve: 'Wavve',
  watcha: 'Watcha',
  coupangplay: 'Coupang Play',
};

const OTT_PROVIDER_ALIASES: Record<string, string> = {
  netflix: 'netflix',
  disney: 'disneyplus',
  disneyplus: 'disneyplus',
  tving: 'tving',
  wavve: 'wavve',
  watcha: 'watcha',
  coupang: 'coupangplay',
  coupangplay: 'coupangplay',
};

function toCanonicalOttKey(providerCode: string): string {
  return providerCode
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[\s_-]+/g, '');
}

export function normalizeOttProviderCode(providerCode: string): string | null {
  if (!providerCode) return null;

  const canonicalKey = toCanonicalOttKey(providerCode);
  return OTT_PROVIDER_ALIASES[canonicalKey] ?? null;
}

export function normalizeOttProviderCodes(providerCodes: string[]): string[] {
  return Array.from(
    new Set(
      providerCodes
        .map((providerCode) => normalizeOttProviderCode(providerCode))
        .filter((providerCode): providerCode is string => providerCode !== null)
    )
  );
}

export function getOttProviderName(providerCode: string): string {
  const normalizedCode = normalizeOttProviderCode(providerCode);
  if (!normalizedCode) {
    return providerCode;
  }

  return OTT_PROVIDER_NAMES[normalizedCode] ?? providerCode;
}

export function buildOttSearchUrl(providerCode: string, title: string): string | null {
  const normalizedCode = normalizeOttProviderCode(providerCode);
  if (!normalizedCode) return null;

  switch (normalizedCode) {
    case 'netflix':
      return `https://www.netflix.com/search?${new URLSearchParams({ q: title }).toString()}`;
    case 'disneyplus':
      return `https://www.disneyplus.com/search?${new URLSearchParams({ q: title }).toString()}`;
    case 'watcha':
      return `https://watcha.com/search?${new URLSearchParams({ query: title }).toString()}`;
    case 'tving':
      return `https://www.tving.com/search?${new URLSearchParams({ keyword: title }).toString()}`;
    case 'wavve':
      return `https://www.wavve.com/search?${new URLSearchParams({ searchWord: title }).toString()}`;
    case 'coupangplay':
      return `https://www.coupangplay.com/search?${new URLSearchParams({ keyword: title }).toString()}`;
    default:
      return null;
  }
}

export function buildOttWatchLinks(providerCodes: string[], title: string): WatchLink[] {
  return normalizeOttProviderCodes(providerCodes)
    .map((providerCode) => {
      const url = buildOttSearchUrl(providerCode, title);
      if (!url) return null;

      return {
        providerCode,
        providerName: getOttProviderName(providerCode),
        url,
      };
    })
    .filter((watchLink): watchLink is WatchLink => watchLink !== null);
}
