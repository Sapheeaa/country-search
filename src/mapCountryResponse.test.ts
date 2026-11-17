import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from './mapCountryResponse';
import type { CountryRaw } from './mapCountryResponse';

describe('mapCountryResponse', () => {
  it('маппит обязательные поля из ответа API', () => {
    const raw = {
      name: 'Spain',
      flags: { png: 'https://flagcdn.com/w320/es.png', svg: 'https://flagcdn.com/es.svg' },
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: [{ name: 'Spanish' }],
    };

    const result = mapCountryResponse(raw);

    expect(result.name).toBe('Spain');
    expect(result.flag).toBe('https://flagcdn.com/w320/es.png');
    expect(result.capital).toBe('Madrid');
    expect(result.region).toBe('Europe');
    expect(result.population).toBe(47351567);
    expect(result.languages).toEqual(['Spanish']);
  });

  it('корректно обрабатывает отсутствие флага (fallback на svg)', () => {
    const raw = {
      name: 'Test',
      flags: { png: undefined, svg: 'https://flagcdn.com/test.svg' },
      capital: 'Test City',
      region: 'Test Region',
      population: 100,
      languages: [],
    };
    const result = mapCountryResponse(raw as unknown as CountryRaw);
    expect(result.flag).toBe('https://flagcdn.com/test.svg');
  });
});
