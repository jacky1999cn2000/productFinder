'use strict';

const _ = require('lodash');
const Nightmare = require('nightmare');
const nightmare = Nightmare();

module.exports = {
  /*
    get HTML based on URL
  */
  getHTML: async (URL) => {
    console.log('calling getHTML');
    try {
      const HTML = await nightmare
        .goto(URL)
        .wait('body')
        .evaluate(() => {
          return document.body.innerHTML;
        })
        .end();
      return HTML
    } catch (e) {
      console.error(e);
      return undefined;
    }

  },

}
