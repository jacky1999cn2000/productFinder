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

  logger.log('start finding all products');

  let productURLs = [];

  let currentPage = config.startPage;
  let counter = 1;

  logger.log('get product URLs from page', currentPage);

  let listPageHTML = await nightmare
    .goto(config.url)
    .wait('body')
    .evaluate(() => {
      return document.body.innerHTML;
    });
  productURLs = _.concat(productURLs, parser.parseGenericProductURLs(listPageHTML));

  while (counter < config.pageCount) {

    logger.log('get product URLs from page', currentPage + counter);

    let selector = '#pagnNextLink';
    listPageHTML = await nightmare
      .click(selector)
      .wait(config.waitTime)
      .evaluate(() => {
        return document.body.innerHTML;
      });
    productURLs = _.concat(productURLs, parser.parseGenericProductURLs(listPageHTML));
    counter++;
  }

  // productURLs = _.slice(productURLs, 0, 1);
  // productURLs = ['https://www.amazon.com/Summer-Infant-Contoured-Changing-Pad/dp/B009EDSWJA/ref=zg_bs_baby-products_2?_encoding=UTF8&psc=1&refRID=R0QDV3F4N2Z5F12J5SCE'];

  logger.log('productURLs', productURLs.length);

  logger.log('retrieving HTMLs from all productURLs - it may take a long time, please be patient');

  let detailPageHTMLs = await productURLs.reduce((accumulator, url) => {
    return accumulator.then((results) => {

      logger.log('retrieving HTML for URL', url);

      return nightmare.goto(url)
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
    productINFOs.push(parser.parseProductINFO(rawHTML, productURLs[index]));
  });

  logger.log('filtering products');

  const filteredProductINFOs = filter.filterProductINFOs(productINFOs, config);

  logger.log('filteredProductINFOs length', filteredProductINFOs.length);

  logger.log('writing products to csv');

  writer.write(filteredProductINFOs, config);

  logger.log('finder successfully finished');
}
