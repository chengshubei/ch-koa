'use strict';

module.exports = (app, config) => {
    if (! config.cors) return;
    config = config.cors || {};
    let origin = '*';
    if (config.origin) origin = String(config.origin);
    let maxAge = String(config.maxAge || 3600);

    app.use((ctx, next) => {
        ctx.vary('Origin');
        if (origin === '*') {
            ctx.set('Access-Control-Allow-Origin', origin);
            //域为*时, 不允许带信息头
            ctx.remove('Access-Control-Allow-Credentials');
        } else {
            let clientOrign = ctx.get('Origin');
            if (! clientOrign || ! origin.includes(clientOrign)) return next();
            ctx.set('Access-Control-Allow-Origin', clientOrign);
            //允许携带Cookie等信息头
            ctx.set('Access-Control-Allow-Credentials', 'true');
        }

        if (ctx.method === 'OPTIONS') {
            //Preflight Request
            if (! ctx.get('Access-Control-Request-Method')) return next();
            //Access-Control-Max-Age
            ctx.set('Access-Control-Max-Age', maxAge);
            // Access-Control-Allow-Methods
            ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS');
            //Access-Control-Allow-Headers
            ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
            ctx.status = 204;
            return;
        }
        return next();
    });
};