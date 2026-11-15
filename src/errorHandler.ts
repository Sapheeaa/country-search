import { HttpError } from './searchCountries.js';

export interface SearchErrorInfo {
  message: string;
  canRetry: boolean;
}

export function getSearchErrorInfo(error: unknown): SearchErrorInfo | null {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return null;
  }
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return { message: 'Превышено время ожидания', canRetry: true };
  }
  if (error instanceof HttpError) {
    return { message: `Ошибка сервера (${error.status})`, canRetry: true };
  }
  return { message: 'Ошибка сети', canRetry: true };
}
