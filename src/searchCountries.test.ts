import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCountries, HttpError } from './searchCountries';

describe('searchCountries', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('выбрасывает TimeoutError, если запрос превышает лимит времени', async () => {
    vi.useFakeTimers(); // Включаем фейковое время

    // Мок fetch, который отклоняется, когда срабатывает signal
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      return new Promise((_resolve, reject) => {
        options.signal?.addEventListener('abort', () => {
          reject(options.signal.reason); // Возвращаем ту же ошибку, что и реальный fetch
        });
      });
    }) as unknown as typeof fetch;

    const controller = new AbortController();
    // Передаем 5000 мс как таймаут (мы добавим его в функцию)
    const promise = searchCountries('spain', controller.signal, 5000);

    // Промотали время на 5000 мс, чтобы сработал таймаут
    vi.advanceTimersByTime(5000);

    // Проверяем, что выброшена ошибка с именем TimeoutError
    await expect(promise).rejects.toHaveProperty('name', 'TimeoutError');
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
