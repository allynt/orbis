'use strict';

function wait(timeoutMilliseconds) {
  let start = new Date().getTime();
  let end = start;
  while(end < start + timeoutMilliseconds) {
    end = new Date().getTime();
  }
}

module.exports = {
  wait,
};
