export interface ApiAccessToken {
  access_token: string,
  refresh_token: string,
  scope: string,
  expires_in: number
  token_type: "Bearer"
}
