const parser = require('url-parse');

const url = 'redis://@cache_redis:15661';

const x = parser(url)

console.log(x);