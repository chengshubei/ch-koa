'use strict';

const path = require('path');
const assert = require('assert');

module.exports = (app, config) => {
    if (config.middlewares && Array.isArray(config.middlewares) && config.middlewares.length > 0) {
        let middlewarePath = path.join(config.path, 'middlewares', config.subpath || '');
        for (let m of config.middlewares) {
            if (m.switch) {
                let file = path.join(middlewarePath, m.file);
                let func = require(file);
                assert(typeof func === 'function', `middleware ${file} not provided a function`);
                func(app, m);
            }
        }
    }
};