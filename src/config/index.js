const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, `.${process.env.NODE_ENV}.env`) });

const packageJson = require('../../package.json');
const { cast } = require('./cast');

const defaultValue = {
  HOST: 'localhost',
  PORT: 3000,
}

const config = {
  basic: {
    name: packageJson.name,
    version: packageJson.version,
    host: cast('HOST', 'string', defaultValue.HOST),
    port: cast('PORT', 'number', defaultValue.PORT),
  },
  secrets: {
    secretKey: cast('SECRET_KEY', 'string', '<FIXME>'),
    /* 
    accessTokenExpiration: cast('ACCESS_TOKEN_EXPIRATION', 'string', '1d'),
    refreshTokenExpiration: cast('ACCESS_TOKEN_EXPIRATION', 'string', '60d')
    */
  },
  gov: {
    apiKey: cast('GOV_API_KEY', 'string'),
  },
  notion: {
    apiKey: cast('NOTION_API_KEY', 'string'),
    databaseId: cast('NOTION_TARGET_DB_ID', 'string'),
  }
};

module.exports = config;