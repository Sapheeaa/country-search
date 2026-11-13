export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return function (...args: unknown[]) {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
