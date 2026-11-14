import { describe, it, expect, vi } from 'vitest';
import { searchCountries } from './searchCountries';
import type { CountryRaw } from './mapCountryResponse';

const mockResponse = (data: CountryRaw[]): Response =>
  ({
    ok: true,
    status: 200,
    json: async () => data,
  }) as Response;

describe('Гонка запросов (Race Condition)', () => {
  it('отменяет старый запрос и показывает результат только последнего', async () => {
    let resolveFirstRequest: (value: Response) => void;
    let resolveSecondRequest: (value: Response) => void;

    globalThis.fetch = vi.fn().mockImplementation((url, options) => {
      return new Promise<Response>((resolve, reject) => {
        options?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });

        if (url.includes('spain')) {
          resolveSecondRequest = resolve;
        } else if (url.includes('sp')) {
          resolveFirstRequest = resolve;
        }
      });
    }) as unknown as typeof fetch;

    let currentResult: CountryRaw[] | null = null;
    let currentController: AbortController | null = null;

    async function performSearch(query: string) {
      if (currentController) {
        currentController.abort();
      }
      currentController = new AbortController();

      try {
        const data = await searchCountries(query, currentController.signal);
        currentResult = data;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        throw error;
      }
    }

    const promise1 = performSearch('sp');
    const promise2 = performSearch('spain');

    resolveSecondRequest!(mockResponse([{ name: 'Spain' } as CountryRaw]));
    resolveFirstRequest!(mockResponse([{ name: 'Spain (OLD)' } as CountryRaw]));

    await promise1;
    await promise2;

    expect(currentResult).toEqual([{ name: 'Spain' }]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
