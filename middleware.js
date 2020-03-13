'use strict';

const path = require('path');

module.exports = (app, config) => {
    if (config.middlewares.length > 0) {
        for (let m of config.middlewares) {
            if (!('switch' in m) || m.switch) {
                let file = path.join(config.MIDDLEWARE_PATH, m.file);
                require(file)(app, m);
            }
        }
    }
};