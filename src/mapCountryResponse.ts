export interface CountryRaw {
  name: string;
  flags: { png?: string; svg?: string };
  capital: string;
  region: string;
  population: number;
  languages: Array<{ name: string }>;
}

export interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
}

export function mapCountryResponse(_raw: CountryRaw): CountryCard {
  // Заглушка (stub) — возвращает пустые данные, чтобы тест упал на assert.
  return {
    name: '',
    flag: '',
    capital: '',
    region: '',
    population: 0,
    languages: [],
  };
}
