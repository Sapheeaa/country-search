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

export function mapCountryResponse(raw: CountryRaw): CountryCard {
  return {
    name: raw.name,
    flag: raw.flags.png ?? raw.flags.svg ?? '',
    capital: raw.capital,
    region: raw.region,
    population: raw.population,
    languages: raw.languages.map((item) => item.name),
  };
}
