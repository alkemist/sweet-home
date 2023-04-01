export interface SpotifyPlaylistInterface {
  id: string,
  public: boolean,
  uri: string,
  type: "playlist",
  name: string,
  description: string,
  href: string,
  images: { height: number | null, width: number | null, url: string }
  external_urls: { spotify: string }
}
