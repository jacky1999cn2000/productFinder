'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const logger = require('./logger');

const subParser1 = require('./subParsers/subParser1');

module.exports = {
  /*
    parse product URLs from Best Seller's List page
  */
  parseBestSellerProductURLs: (rawHTML) => {

    let $ = cheerio.load(rawHTML);

    let productURLs = $('.zg_itemImmersion .zg_itemWrapper .p13n-asin > a[class=a-link-normal]');

    productURLs = _.map(productURLs, (productURL) => {
      return productURL.attribs.href;
    });

    return productURLs;
  },

  /*
    parse product URLs from Generic Result's List page
  */
  parseGenericProductURLs: (rawHTML) => {

    let $ = cheerio.load(rawHTML);

    let productURLs = $('#s-results-list-atf > li > div > div:nth-child(3) > div:nth-child(1) > a');

    productURLs = _.map(productURLs, (productURL) => {
      return productURL.attribs.href;
    });

    return productURLs;
  },

  /*
    parse product info from Detail page
  */
  parseProductINFO: (rawHTML, url) => {

    logger.log('parse productINFO for URL', url);

    let productINFO = {
      NAME: 'n/a',
      ASIN: 'n/a',
      ABSR: 'n/a',
      PRICE: 'n/a',
      STAR: 'n/a',
      REVIEW: 'n/a',
      DIMENSION: 'n/a',
      LENGTH: 'n/a',
      WIDTH: 'n/a',
      HEIGHT: 'n/a',
      WEIGHT: 'n/a',
      UNIT: 'n/a',
      URL: 'n/a'
    };
    const $ = cheerio.load(rawHTML);

    let name = $('#productTitle');
    name = _.trim(name.html());

    productINFO.NAME = name;
    productINFO.URL = url;

    let price = $('#priceblock_ourprice').text();
    if (typeof price == 'undefined' || price == '') {
      price = $('#priceblock_saleprice').text();
    }
    if (typeof price == 'string' && price != '') {
      price = price.split('$')[1];
      productINFO.PRICE = parseFloat(price.replace(/,/g, ''));
    }

    productINFO = subParser1.parseProductINFO(rawHTML, productINFO);

    return productINFO;
  }

}
