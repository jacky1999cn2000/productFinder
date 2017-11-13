'use strict';

module.exports = {
  /*
    get all products based on page number
  */
  log: (header, content) => {
    console.log('\r');
    console.log('*** ' + header + ' ***');

    if (typeof content != 'undefined') {
      console.log(content);
    }
  }

}
