'use strict';

module.exports = {
  /*
    get all products based on page number
  */
  log: (header, content) => {
    console.log('\r');
    console.log('*** ' + header + ' ***');

    if (content) {
      console.log(content);
    }
  }

}
