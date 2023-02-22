const {EnvironmentPlugin} = require('webpack');
require('dotenv').config();
module.exports = {
  plugins: [
    new EnvironmentPlugin([
      'APP_NAME',
      'APP_VERSION'
    ])
  ]
};
