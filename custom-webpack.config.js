const {EnvironmentPlugin} = require('webpack');
require('dotenv').config();

module.exports = {
  cache: false,
  plugins: [
    new EnvironmentPlugin([
      'APP_NAME',
      'APP_VERSION',
      'APP_DEBUG',
      'APP_PROXY',
      'APP_AUTO_LOGIN',
      'APP_AUTO_PASSWORD',
      'JEEDOM_HOST',
      'FIREBASE_API_KEY',
      'FIREBASE_APP_ID',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'GOOGLE_CLOUD_OPERATIONS_API_KEY',
      'SPOTIFY_CLIENT_ID',
      'SPOTIFY_CLIENT_SECRET',
      'SPOTIFY_USER_ID',
      'SONOS_KEY',
      'SONOS_SECRET',
    ])
  ]
}
