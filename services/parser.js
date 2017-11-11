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
    parse product name from Detail page
  */
  parseProductINFO: (rawHTML, url) => {

    // const header = ['NAME', 'ASIN', 'ABSR', 'PRICE', 'REVIEW', 'DIMENSION', 'WEIGHT', 'URL'];


    logger.log('parse productINFO for URL', url);

    let productINFO = {
      NAME: '',
      ASIN: '',
      ABSR: '',
      PRICE: 0,
      STAR: 0,
      REVIEW: 0,
      DIMENSION: '',
      WEIGHT: 0,
      UNIT: '',
      URL: ''
    };
    const $ = cheerio.load(rawHTML);

    let name = $('#productTitle');
    name = _.trim(name.html());

    let price = $('#priceblock_ourprice').text();
    // console.log('priceblock_ourprice ', price);
    // console.log('typeof price ', typeof price);
    if (typeof price == 'undefined' || price == '') {
      price = $('#priceblock_saleprice').text();
      // console.log('priceblock_saleprice ', price);
    }
    price = price.split('$')[1];

    productINFO.NAME = name;
    productINFO.URL = url;
    productINFO.PRICE = price;

    // item  ProductDimensions:7.5x2.5x6.8inches;1.1pounds
    // item  ShippingWeight:1.2pounds(Viewshippingratesandpolicies)
    // item  DomesticShipping:Currently,itemcanbeshippedonlywithintheU.S.andtoAPO/FPOaddresses.ForAPO/FPOshipments,pleasecheckwiththemanufacturerregardingwarrantyandsupportissues.
    // item  InternationalShipping:Thisitemisnoteligibleforinternationalshipping.LearnMore
    // item  ASIN:B00CYBXKR8
    // item  UPC:813859021153020424101114
    // item  Itemmodelnumber:10HBC01111
    // item  AverageCustomerReview:4.4outof5stars143customerreviews
    // item  AmazonBestSellersRank:#1,104inHealth&Household(SeeTop100inHealth&Household)#2inSports&Outdoors>OutdoorRecreation>Camping&Hiking>Safety&Survival>FirstAidKits#3inHealth&Household>HealthCare>FirstAid>FirstAidKits


    $('#detail-bullets > table > tbody > tr > td > div.content > ul > li').each(function(i, elem) {
      let item = $(this).text();
      item = item.replace(/\r?\n|\r/g, '');
      item = item.replace(/\s/g, '');
      console.log('item ', item);

      if (item.indexOf('ASIN') != -1) {
        console.log('ASIN...');
        item = item.split(':')[1];
        productINFO.ASIN = item;
      }
      if (item.indexOf('AmazonBestSellersRank') != -1) {
        console.log('AmazonBestSellersRank...');
        item = item.split(':#')[1];
        item = item.split('in')[0];
        productINFO.ABSR = item;
      }
      if (item.indexOf('AverageCustomerReview') != -1) {
        console.log('AverageCustomerReview...');
        item = item.split(':')[1];
        let star = item.split('outof')[0];
        let review = item.split('stars')[1].split('customerreviews')[0];
        productINFO.STAR = star;
        productINFO.REVIEW = review;
      }

    });

    return productINFO;
  }

}
