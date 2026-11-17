export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  delay: number,
): (...args: Args) => void {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return function (...args: Args) {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
