export function debounce<T extends (...args: unknown[]) => void>(fn: T, _delay: number): T {
  // Заглушка: просто возвращаем исходную функцию, без задержек
  return fn;
}
