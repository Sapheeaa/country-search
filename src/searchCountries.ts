import type { CountryRaw } from './mapCountryResponse';

// Свой класс ошибки для HTTP-статусов
export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP Error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(query: string, signal: AbortSignal): Promise<CountryRaw[]> {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}`;
  const response = await fetch(url, { signal }); // результат сетевого запроса
  if (response.status === 404) {
    // не ошибка, просто «ничего не найдено»
    return [];
  }
  if (response.ok !== true) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<CountryRaw[]>;
}
