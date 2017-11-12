'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const logger = require('./logger');

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
    if (typeof price != 'undefined' || price != '') {
      price = price.split('$')[1];
      productINFO.PRICE = parseFloat(price.replace(/,/g, ''));
    }

    $('#detail-bullets > table > tbody > tr > td > div.content > ul > li').each(function(i, elem) {
      let item = $(this).text();
      item = item.replace(/\r?\n|\r/g, '');
      item = item.replace(/\s/g, '');

      if (item.indexOf('ASIN') != -1) {
        item = item.split(':')[1];
        productINFO.ASIN = item;
      }
      if (item.indexOf('AmazonBestSellersRank') != -1) {
        item = item.split(':#')[1];
        item = item.split('in')[0];
        productINFO.ABSR = parseInt(item.replace(/,/g, ''));
      }
      if (item.indexOf('AverageCustomerReview') != -1) {
        item = item.split(':')[1];
        let star = item.split('outof')[0];
        let review = item.split('stars')[1].split('customerreviews')[0];
        productINFO.STAR = parseFloat(star.replace(/,/g, ''));
        productINFO.REVIEW = parseInt(review.replace(/,/g, ''));
      }
      if (item.indexOf('ProductDimensions') != -1) {
        item = item.split(':')[1].split('inches')[0];
        let dimension = item;
        let dimensions = item.split('x');
        productINFO.DIMENSION = dimension + ' inches';
        productINFO.LENGTH = parseFloat(dimensions[0].replace(/,/g, ''));
        productINFO.WIDTH = parseFloat(dimensions[1].replace(/,/g, ''));
        productINFO.HEIGHT = parseFloat(dimensions[2].replace(/,/g, ''));
      }
      if (item.indexOf('ShippingWeight') != -1) {
        item = item.split(':')[1];
        let weight, unit;
        if (item.indexOf('pounds') != -1) {
          unit = 'pounds';
          weight = item.split('pounds')[0];
        } else {
          unit = 'ounces';
          weight = item.split('ounces')[0];
        }
        productINFO.WEIGHT = parseFloat(weight.replace(/,/g, ''));
        productINFO.UNIT = unit;
      }

    });

    return productINFO;
  }

}
