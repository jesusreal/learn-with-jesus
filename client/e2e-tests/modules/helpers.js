'use strict';
module.exports = {
  log(fn, info) {
    fn(() => console.info('\n', info));
  }
};
