'use strict';

const _ = require('lodash');

const self = module.exports = {
  /*
    filter productINFOs based on config
  */
  filterProductINFOs: (productINFOs, config) => {
    return _.filter(productINFOs, (productINFO) => {
      const checkedPrice = self.checkPrice(productINFO, config);
      const checkedABSR = self.checkABSR(productINFO, config);
      const checkedWeight = self.checkWeight(productINFO, config);
      const checkedStar = self.checkStar(productINFO, config);
      const checkedReview = self.checkReview(productINFO, config);
      const checkedLength = self.checkLength(productINFO, config);
      const checkedWidth = self.checkWidth(productINFO, config);
      const checkedHeight = self.checkHeight(productINFO, config);

      // console.log('productINFO ', productINFO);
      // console.log('\n');
      // console.log('checkedPrice ', checkedPrice);
      // console.log('checkedABSR ', checkedABSR);
      // console.log('checkedWeight ', checkedWeight);
      // console.log('checkedStar ', checkedStar);
      // console.log('checkedReview ', checkedReview);
      // console.log('checkedLength ', checkedLength);
      // console.log('checkedWidth ', checkedWidth);
      // console.log('checkedHeight ', checkedHeight);
      // console.log('\n');
      // console.log('\n');

      return checkedPrice && checkedABSR && checkedWeight && checkedStar && checkedReview && checkedLength && checkedWidth && checkedHeight;
    });
  },

  /*
    check price
  */
  checkPrice: (productINFO, config) => {
    if (config.filterPrice) {
      if (productINFO.PRICE == 'n/a') {
        return !config.removePriceNA;
      }
      return productINFO.PRICE >= config.minPRICE && productINFO.PRICE <= config.maxPRICE;
    } else {
      return true;
    }
  },

  /*
    check ABSR
  */
  checkABSR: (productINFO, config) => {
    if (config.filterABSR) {
      if (productINFO.ABSR == 'n/a') {
        return !config.removeABSRNA;
      }
      return productINFO.ABSR >= config.minABSR && productINFO.ABSR <= config.maxABSR;
    } else {
      return true;
    }
  },

  /*
    check weight
  */
  checkWeight: (productINFO, config) => {
    if (config.filterWeight) {
      if (productINFO.WEIGHT == 'n/a') {
        return !config.removeWeightNA;
      }

      let productWeight = 0;
      let minWeight = 0;
      let maxWeight = 0;

      if (productINFO.UNIT == 'pounds') {
        productWeight = productINFO.WEIGHT * 16;
      } else {
        productWeight = productINFO.WEIGHT;
      }
      if (config.weightUnit == 'pounds') {
        minWeight = config.minWeight * 16;
        maxWeight = config.maxWeight * 16;
      } else {
        minWeight = config.minWeight;
        maxWeight = config.maxWeight;
      }
      return productWeight >= minWeight && productWeight <= maxWeight;
    } else {
      return true;
    }
  },

  /*
    check Star
  */
  checkStar: (productINFO, config) => {
    if (config.filterStar) {
      if (productINFO.STAR == 'n/a') {
        return !config.removeStarNA;
      }
      return productINFO.STAR >= config.minStar && productINFO.STAR <= config.maxStar;
    } else {
      return true;
    }
  },

  /*
    check Review
  */
  checkReview: (productINFO, config) => {
    if (config.filterReview) {
      if (productINFO.REVIEW == 'n/a') {
        return !config.removeReviewNA;
      }
      return productINFO.REVIEW >= config.minReview && productINFO.REVIEW <= config.maxReview;
    } else {
      return true;
    }
  },

  /*
    check Length
  */
  checkLength: (productINFO, config) => {
    if (config.filterLength) {
      if (productINFO.LENGTH == 'n/a') {
        return !config.removeLengthNA;
      }
      return productINFO.LENGTH >= config.minLength && productINFO.LENGTH <= config.maxLength;
    } else {
      return true;
    }
  },

  /*
    check Width
  */
  checkWidth: (productINFO, config) => {
    if (config.filterWidth) {
      if (productINFO.WIDTH == 'n/a') {
        return !config.removeWidthNA;
      }
      return productINFO.WIDTH >= config.minWidth && productINFO.WIDTH <= config.maxWidth;
    } else {
      return true;
    }
  },

  /*
    check Height
  */
  checkHeight: (productINFO, config) => {
    if (config.filterHeight) {
      if (productINFO.HEIGHT == 'n/a') {
        return !config.removeHeightNA;
      }
      return productINFO.HEIGHT >= config.minHeight && productINFO.HEIGHT <= config.maxHeight;
    } else {
      return true;
    }
  },


}
