const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const compact = <T>(list: (T | null | undefined)[]): T[] =>
  list.filter(isDefined);
