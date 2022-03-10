export function removeUndefined<T extends {}>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([key, value]) => value !== undefined),
  ) as T;
}
