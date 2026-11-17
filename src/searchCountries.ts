import type { CountryRaw } from './mapCountryResponse';

export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP Error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(
  query: string,
  signal: AbortSignal,
  timeoutMs: number = 5000,
): Promise<CountryRaw[]> {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}`;

  const timeoutController = new AbortController();

  const timeoutId = setTimeout(() => {
    const error = new DOMException('Timeout exceeded', 'TimeoutError');
    timeoutController.abort(error);
  }, timeoutMs);

  const combinedSignal = AbortSignal.any([signal, timeoutController.signal]);

  try {
    const response = await fetch(url, { signal: combinedSignal });

    if (response.status === 404) {
      return [];
    }
    if (response.ok !== true) {
      throw new HttpError(response.status);
    }

    return response.json() as Promise<CountryRaw[]>;
  } finally {
    clearTimeout(timeoutId);
  }
}
