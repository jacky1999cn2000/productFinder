'use strict';

const _ = require('lodash');
const parser = require('../services/parser');
const logger = require('../services/logger');

const Nightmare = require('nightmare');
// const nightmare = Nightmare();
const nightmare = Nightmare({
  show: true
});

const header = ['NAME', 'ASIN', 'ABSR', 'PRICE', 'REVIEW', 'DIMENSION', 'WEIGHT'];

module.exports = async (config) => {
  logger.log('start productFinder');
  logger.log('config', config);

  let productURLs = [];

  logger.log('get product URLs from page 1');
  let listPageHTML = await nightmare
    .goto(config.url)
    .wait('body')
    .evaluate(() => {
      return document.body.innerHTML;
    });
  productURLs = _.concat(productURLs, parser.parseProductURLs(listPageHTML));

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
    productURLs = _.concat(productURLs, parser.parseProductURLs(listPageHTML));
    counter++;
  }

  productURLs = _.slice(productURLs, 0, 5);
  logger.log('productURLs' + productURLs.length);
  logger.log('getting HTMLs from all productURLs, please wait');

  let detailPageHTMLs = await productURLs.reduce((accumulator, url) => {
    return accumulator.then((results) => {
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

  let productINFOs = _.map(detailPageHTMLs, parser.parseProductINFO);
  console.log('productINFOs ', productINFOs);

}
