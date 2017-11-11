'use strict';

let _ = require('lodash');
let cheerio = require('cheerio');

module.exports = {
  /*
    parse product URLs from List page
  */
  parseProductURLs: (rawHTML) => {

    let $ = cheerio.load(rawHTML);

    let productURLs = $('.zg_itemImmersion .zg_itemWrapper .p13n-asin > a[class=a-link-normal]');

    productURLs = _.map(productURLs, (productURL) => {
      return productURL.attribs.href;
    });

    return productURLs;
  },

  /*
    parse product name from Detail page
  */
  parseProductINFO: (rawHTML) => {
    let $ = cheerio.load(rawHTML);

    let name = $('#productTitle');
    name = _.trim(name.html());

    return name;
  }

}
