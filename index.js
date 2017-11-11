'use strict';

let config = require('./config.json');
let productFinder = require('./modules/productFinder');

async function execute() {
  productFinder(config);
};

execute();
