'use strict';

const _ = require('lodash');
const cheerio = require('cheerio');
const logger = require('../logger');

module.exports = {
  /*
    get all products based on page number
  */
  parseProductINFO: (rawHTML, productINFO) => {

    let $ = cheerio.load(rawHTML);

    $('#prodDetails > div.wrapper.USlocale > div.column.col2 > div:nth-child(1) > div.content.pdClearfix > div > div > table > tbody > tr').each(function(i, elem) {

      let header = $(this).find('td:nth-child(1)').text();
      let item = $(this).find('td:nth-child(2)').text();

      if ((typeof header == 'string' && header != '') || (typeof item == 'string' && item != '')) {
        header = header.replace(/\r?\n|\r/g, '');
        header = header.replace(/\s/g, '');
        item = item.replace(/\r?\n|\r/g, '');
        item = item.replace(/\s/g, '');
      } else {
        return productINFO;
      }

      if (header.indexOf('ASIN') != -1) {
        productINFO.ASIN = item;
      }
      if (header.indexOf('BestSellersRank') != -1) {
        if (item.indexOf('#') != -1 && item.indexOf('in') != -1) {
          item = item.split('#')[1];
          item = item.split('in')[0];
          if (typeof item == 'string' && item != '') {
            productINFO.ABSR = parseInt(item.replace(/,/g, ''));
          }
        }
      }
      if (header.indexOf('CustomerReviews') != -1) {
        if (item.indexOf('customerreviews') != -1) {
          item = item.split('customerreviews')[0];
          if (item.indexOf('outof') != -1) {
            let star = item.split('outof')[0];
            if (typeof star == 'string' && star != '') {
              productINFO.STAR = parseFloat(star.replace(/,/g, ''));
            }
          }
          if (item.indexOf('stars') != -1) {
            let review = item.split('stars')[1];
            if (typeof review == 'string' && review != '') {
              productINFO.REVIEW = parseInt(review.replace(/,/g, ''));
            }
          }
        }
      }
      if (header.indexOf('ProductDimensions') != -1) {
        if (item.indexOf('inches') != -1) {
          item = item.split('inches')[0];
          let dimension = item;
          productINFO.DIMENSION = dimension + ' inches';
          if (item.indexOf('x') != -1) {
            let dimensions = item.split('x');
            if (typeof dimensions[0] == 'string' && dimensions[0] != '') {
              productINFO.LENGTH = parseFloat(dimensions[0].replace(/,/g, ''));
            }
            if (typeof dimensions[1] == 'string' && dimensions[1] != '') {
              productINFO.WIDTH = parseFloat(dimensions[1].replace(/,/g, ''));
            }
            if (typeof dimensions[2] == 'string' && dimensions[2] != '') {
              productINFO.HEIGHT = parseFloat(dimensions[2].replace(/,/g, ''));
            }
          }
        }
      }
      if (header.indexOf('ShippingWeight') != -1) {
        let weight, unit;
        if (item.indexOf('pounds') != -1) {
          unit = 'pounds';
          weight = item.split('pounds')[0];
        } else {
          unit = 'ounces';
          weight = item.split('ounces')[0];
        }
        if (typeof weight == 'string' && weight != '') {
          productINFO.WEIGHT = parseFloat(weight.replace(/,/g, ''));
        }
        productINFO.UNIT = unit;
      }

    });

    return productINFO;
  }

}
