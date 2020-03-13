'use strict';

const path = require('path');
const fs = require('fs');
const log4js = require('log4js');
const {BaseError, SystemError, NotFoundError} = require('ch-error');

const Logger = log4js.getLogger('response');

module.exports = (app, config) => {
    const Message = {};
    if (config.i18n) {
        const fls = fs.readdirSync(config.MESSAGE_PATH);
        for (let v of fls) {
            if (v.slice(-3) !== '.js') continue;
            let name = v.slice(0, -3);
            Message[name] = require(path.join(config.MESSAGE_PATH, v));
        }
    }

    app.use(async (ctx, next) => {
        try {
            ctx.body = {
                code: 200,
                data: null,
                message: 'OK',
                error: ''
            };
            await next();
        } catch (e) {
            if (! (e instanceof BaseError)) {
                Logger.error(`${ctx.path} request operate an no-base-error, name: ${e.name}, message: ${e.message}`);
                Logger.error(e.stack);
                e = new SystemError(e.message || String(e));
            } else if (e instanceof SystemError) {
                Logger.error(`${ctx.path} request operate a system Error: ${e.error}`);
                Logger.error(e.stack);
            } else if (e instanceof NotFoundError) {
                Logger.warn(`recv 404 request, path: ${ctx.path}, method: ${ctx.method}`);
            }

            if (config.i18n && ctx.get('lang') && ctx.get('lang') !== 'zh_CN') {
                let language = Message[ctx.get('lang')];
                e.message = language[e.code] || e.message;
            }
            let response = {
                code: e.code || 500,
                message: e.message || 'unknown reason',
                data: e.data || null,
                error: e.error || e.message || String(e)
            };
            if (config.debug) {
                Logger.warn(`*************DEBUG**************** \ntime: ${new Date().toLocaleString()}, ${ctx.url} operate ${ctx.method} request failed \nheader info: ${JSON.stringify(ctx.headers)} \nrequest body info: ${JSON.stringify(ctx.request.body)} \nresponse info: ${JSON.stringify(response)} \nerror name: ${e.name} \n`);
            }
            ctx.body = response;
        }
    });
};