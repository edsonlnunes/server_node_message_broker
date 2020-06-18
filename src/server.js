const express = require('./express-config.js');

express.listen('3334', () => console.log('Ouvindo na porta 3333'));
