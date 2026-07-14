export interface Paginated<T> {
  count: number;
  next: string | null;
  results: T[];
}
