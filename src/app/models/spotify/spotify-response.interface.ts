export interface SpotifyResponseInterface<T> {
  href: string,
  items: T[],
  limit: number,
  next: string,
  offset: number,
  previous: null | number,
  total: number
}
