import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchCountries, HttpError } from './searchCountries';

describe('searchCountries', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('возвращает массив стран при успешном ответе (200 OK)', async () => {
    const mockData = [{ name: 'Spain' }];

    // Мокаем fetch: успешный ответ
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const signal = new AbortController().signal;
    const result = await searchCountries('spain', signal);

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      'https://countries.dev/name/spain',
      expect.objectContaining({ signal }),
    );
  });

  it('возвращает пустой массив при 404 (нет совпадений)', async () => {
    // Мокаем fetch: ответ 404
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const signal = new AbortController().signal;
    const result = await searchCountries('unknown', signal);

    // 404 — это не ошибка, а пустой список
    expect(result).toEqual([]);
  });

  it('бросает HttpError при 500 (ошибка сервера)', async () => {
    // Мокаем fetch: ответ 500
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const signal = new AbortController().signal;

    // Проверяем, что функция выбрасывает HttpError
    await expect(searchCountries('spain', signal)).rejects.toThrow(HttpError);

    // Проверяем, что статус ошибки равен 500
    try {
      await searchCountries('spain', signal);
    } catch (error) {
      expect((error as HttpError).status).toBe(500);
    }
  });
});
