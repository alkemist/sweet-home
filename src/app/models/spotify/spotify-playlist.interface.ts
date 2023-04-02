export interface SpotifyPlaylistInterface {
  id: string, // "2Ryg9Mq25idinvrNCw4cK0"
  type: "playlist",
  public: boolean,
  uri: string, // "spotify:playlist:2Ryg9Mq25idinvrNCw4cK0"
  name: string, // "Pokémon & Chill 🌆 lofi beats"
  description: string,
  href: string, // "https://api.spotify.com/v1/playlists/2Ryg9Mq25idinvrNCw4cK0"
  snapshot_id: string, // "MjU5LGRjM2I2ZjRiYmI3MzBhM2ZmZTRhMTgyYTJlNjA1MzQ0Y2U1N2Y0M2Q="
  images: { height: number | null, width: number | null, url: string }
  external_urls: {
    spotify: string // "https://open.spotify.com/playlist/2Ryg9Mq25idinvrNCw4cK0"
  },
  tracks: {
    href: string, // "https://api.spotify.com/v1/playlists/2Ryg9Mq25idinvrNCw4cK0/tracks"
    total: number
  },
  owner: {
    id: string, // "gamechops"
    type: string, // "user"
    display_name: string, // "GameChops"
    href: string, // "https://api.spotify.com/v1/users/gamechops"
    uri: string, // "spotify:user:gamechops"
    external_urls: {
      spotify: string // "https://open.spotify.com/user/gamechops"
    },
  }
}
