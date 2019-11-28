'use strict';

module.exports = (config) => {
    return function(ctx, next) {
        ctx.vary('Origin');
        let origin = '*';
        if (config.origin) {
            let clientOrign = ctx.get('Origin');
            if (! clientOrign) return next();
            if (typeof config.origin === 'string') {
                if (config.origin.indexOf('*.') === -1) {
                    if (config.origin !== clientOrign) return next();
                } else {
                    let l = config.origin.split('*.');
                    for (let v of l) {
                        if (v && clientOrign.indexOf(v) === -1) return next();
                    }
                }
            }
            if (Array.isArray(config.origin) && config.origin.length > 0) {
                for (let v of config.origin) {
                    if (config.origin.indexOf('*.') === -1) {
                        if (config.origin !== clientOrign) return next();
                    } else {
                        let l = v.split('*.');
                        for (let vv of l) {
                            if (vv && clientOrign.indexOf(vv) === -1) return next();
                        }
                    }
                }
            }
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