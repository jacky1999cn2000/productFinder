let config = require('./config.json');
let productFinder = require('./modules/productFinder');

// var cheerio = require('cheerio');
// var Nightmare = require('nightmare');
// var nightmare = Nightmare({
//   show: true
// });

async function execute() {
  productFinder(config);
};

execute();

// nightmare.goto(config.url)
//   .wait(2000)
//   .evaluate(function() {
//     var productURLs = [];
//     // create an array to hold all gigs gathered by following code
//     jquery('.zg_itemImmersion .zg_itemWrapper .p13n-asin > a[class=a-link-normal]').each(function() {
//       productURLs.push(productURL.attribs.href)
//     })
//     return productURLs
//   })
//   .end()
//   .then(function(result) {
//     console.log("To: nelsonkhan@gmail.com")
//     console.log("From: nelsonkhan@gmail.com")
//     console.log("Subject: Today's Gigs")
//     console.log("\n")
//     // set headers for email
//     for (let productURL in result) {
//       console.log('productURL ', productURL)
//       console.log("\n")
//     }
//     // print each gig to the console in a neat format
//   })


// nightmare
//   .goto(config.url)
//   .wait(2000)
//   .evaluate(function() {
//
//     //here is where I want to return the html body
//     return document.body.innerHTML
//
//
//   })
//   .end()
//   .then(function(body) {
//     //loading html body to cheerio
//     var $ = cheerio.load(body);
//     console.log(body);
//   })
