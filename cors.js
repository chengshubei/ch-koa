'use strict';

const assert = require('assert');

module.exports = (config) => {
    config = config.cors || {};
    return function(ctx, next) {
        ctx.vary('Origin');
        let origin = '*';
        if (config.origin) {
            assert(typeof config.origin === 'string', 'origin mast be string');
            let clientOrign = ctx.get('Origin');
            if (! clientOrign || config.origin.indexOf(clientOrign) === -1) return next();
            origin = clientOrign;
        }
        // Access-Control-Allow-Origin
        ctx.set('Access-Control-Allow-Origin', origin);
        //Access-Control-Allow-Credentials
        if (origin === '*') ctx.remove('Access-Control-Allow-Credentials');
        else ctx.set('Access-Control-Allow-Credentials', 'true');

        if (ctx.method === 'OPTIONS') {
            //Preflight Request
            if (! ctx.get('Access-Control-Request-Method')) return next();
            //Access-Control-Max-Age
            ctx.set('Access-Control-Max-Age', String(config.maxAge || 3600));
            // Access-Control-Allow-Methods
            ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS');
            //Access-Control-Allow-Headers
            ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
            ctx.status = 204;
            return;
        }
        return next();
    };
};