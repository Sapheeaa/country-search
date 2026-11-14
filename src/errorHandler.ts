export interface SearchErrorInfo {
  message: string;
  canRetry: boolean;
}

export function getSearchErrorInfo(_error: unknown): SearchErrorInfo | null {
  // Заглушка (stub) — возвращает null для любой ошибки.
  // Благодаря этому тест упадет на проверке (assert),
  // а не из-за того, что функции не существует.
  return null;
}
