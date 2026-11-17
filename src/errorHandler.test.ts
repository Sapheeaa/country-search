import { describe, it, expect } from 'vitest';
import { getSearchErrorInfo } from './errorHandler';
import { HttpError } from './searchCountries';

describe('getSearchErrorInfo', () => {
  it('возвращает null для AbortError (отмена пользователем)', () => {
    const error = new DOMException('Aborted', 'AbortError');
    // При отмене мы не должны показывать ошибку, возвращаем null
    expect(getSearchErrorInfo(error)).toBeNull();
  });

  it('возвращает сообщение и флаг retry для TimeoutError', () => {
    const error = new DOMException('Timeout', 'TimeoutError');
    const result = getSearchErrorInfo(error);
    expect(result).toEqual({ message: 'Превышено время ожидания', canRetry: true });
  });

  it('возвращает сообщение для HttpError', () => {
    const error = new HttpError(500);
    const result = getSearchErrorInfo(error);
    expect(result).toEqual({ message: 'Ошибка сервера (500)', canRetry: true });
  });

  it('возвращает сообщение для неизвестной ошибки (сеть)', () => {
    const error = new Error('Network failed');
    const result = getSearchErrorInfo(error);
    expect(result).toEqual({ message: 'Ошибка сети', canRetry: true });
  });
});
