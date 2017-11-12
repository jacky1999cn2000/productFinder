'use strict';

const _ = require('lodash');
const parser = require('../services/parser');
const logger = require('../services/logger');
const filter = require('../services/filter');
const writer = require('../services/writer');

const Nightmare = require('nightmare');
// const nightmare = Nightmare();
const nightmare = Nightmare({
  show: true
});

module.exports = async (config) => {

  logger.log('start finding best seller products');

  let productURLs = [];

  logger.log('get product URLs from page 1');

  let listPageHTML = await nightmare
    .goto(config.url)
    .wait('body')
    .evaluate(() => {
      return document.body.innerHTML;
    });
  productURLs = _.concat(productURLs, parser.parseBestSellerProductURLs(listPageHTML));

  let counter = 2;
  while (counter < 6) {

    logger.log('get product URLs from page ' + counter);

    let selector = '#zg_page' + counter + ' a';
    listPageHTML = await nightmare
      .click(selector)
      .wait(config.waitTime)
      .evaluate(() => {
        return document.body.innerHTML;
      });
    productURLs = _.concat(productURLs, parser.parseBestSellerProductURLs(listPageHTML));
    counter++;
  }

  // productURLs = _.slice(productURLs, 0, 3);
  // productURLs = ['/Waterproof-Container-Emergency-Mountaineering-Activities/dp/B075Y4HPS2/ref=zg_bs_3401101_79?_encoding=UTF8&refRID=77QQ6ET6RTHJXG3KR05Y'];

  logger.log('productURLs', productURLs.length);

  logger.log('retrieving HTMLs from all productURLs - it may take a long time, please be patient');

  let detailPageHTMLs = await productURLs.reduce((accumulator, url) => {
    return accumulator.then((results) => {

      logger.log('retrieving HTML for URL', 'https://www.amazon.com' + url);

      return nightmare.goto('https://www.amazon.com' + url)
        .wait('body')
        .evaluate(() => {
          return document.body.innerHTML;
        })
        .then((result) => {
          results.push(result);
          return results;
        });
    });
  }, Promise.resolve([]));

  await nightmare.end();

  logger.log('parsing information for all products - it may take a long time, please be patient');

  let productINFOs = [];
  detailPageHTMLs.forEach((rawHTML, index) => {
    productINFOs.push(parser.parseProductINFO(rawHTML, 'https://www.amazon.com' + productURLs[index]));
  });

  logger.log('filtering products');

  const filteredProductINFOs = filter.filterProductINFOs(productINFOs, config);

  logger.log('filteredProductINFOs length', filteredProductINFOs.length);

  logger.log('writing products to csv');

  writer.write(filteredProductINFOs, config);

  logger.log('finder successfully finished');
}
