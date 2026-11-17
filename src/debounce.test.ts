import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';
describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Включаем фальшивое время перед каждым тестом
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Очищаем все моки после каждого теста
  });
});
it('не вызывает функцию сразу после вызова', () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 300);
  debounced();
  expect(fn).not.toHaveBeenCalled();
});
