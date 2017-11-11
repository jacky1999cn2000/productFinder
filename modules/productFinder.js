'use strict';



const retriever = require('../services/retriever');
const parser = require('../services/parser');
const logger = require('../services/logger');

const Nightmare = require('nightmare');
const nightmare = Nightmare({
  show: true
});

const header = ['NAME', 'ASIN', 'ABSR', 'PRICE', 'REVIEW', 'DIMENSION', 'WEIGHT'];

module.exports = async (config) => {
  logger.log('start productFinder');
  logger.log('config', config);

  let listPageHTML = await retriever.getHTML(config.url + '#1');
  let productURLs = parser.parseProductURLs(listPageHTML);

  let detailPageHTMLs = [];

  productURLs.reduce(function(accumulator, url) {
    return accumulator.then(function(results) {
      return nightmare.goto('https://www.amazon.com' + url)
        .wait('body')
        .title()
        .then(function(result) {
          results.push(result);
          return results;
        });
    });
  }, Promise.resolve([])).then(function(results) {
    detailPageHTMLs = results;

  });

  console.log(detailPageHTMLs);

}
