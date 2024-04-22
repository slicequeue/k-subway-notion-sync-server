const { Client, APIErrorCode  } = require('@notionhq/client');

const config = require('../config');

const notion = new Client({
    auth: config.notion.apiKey,
});

module.exports = {
  notion,
}
