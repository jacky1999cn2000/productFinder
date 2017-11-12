'use strict';

const fs = require('fs');
const fastCsv = require("fast-csv");

module.exports = {
  /*
    write results to csv file
  */
  write: (filteredProductINFOs, config) => {
    const wstream = fs.createWriteStream(__dirname + '/../output/' + config.fileName + '.csv');
    fastCsv
      .write(filteredProductINFOs, {
        headers: true
      })
      .pipe(wstream);
  }

}
