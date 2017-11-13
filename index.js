'use strict';

const config = require('./config.json');
const logger = require('./services/logger');

const bestSellerFinder = require('./modules/bestSellerFinder');
const genericFinder = require('./modules/genericFinder');

async function execute() {
  // return;
  switch (config.findType) {
    case 'bestSeller':
      bestSellerFinder(config);
      break;
    case 'findAll':
      genericFinder(config);
      break;
    default:
      logger.log('Wrong findType');
  }
};

execute();
