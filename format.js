'use strict';

const path = require('path');
const log4js = require('log4js');
const {BaseError, SystemError, NotFoundError} = require('ch-error');

const Logger = log4js.getLogger('response');
function create(statusCode = -1, message, error, data) {
    let result = {};
    result.code = statusCode;
    result.data = data || null;
    result.message = message ? String(message) : '';
    result.error = error || '';
    return result;
}
function success(data, message) {
    let result = {};
    result.code = 200;
    result.data = data || null;
    result.message = message || 'OK';
    result.error = '';
    return result;
}

module.exports = (app, config) => {
    app.use(async (ctx, next) => {
        try {
            ctx.body = success();
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
                let messagePath = path.join(config.MESSAGE_PATH, ctx.get('lang'));
                e.message = require(messagePath)[e.code] || e.message;
            }
            let response = create(e.code, e.message, e.error, e.data);
            if (config.debug) {
                Logger.warn(`*************DEBUG**************** \ntime: ${new Date().toLocaleString()}, ${ctx.url} operate ${ctx.method} request failed \nheader info: ${JSON.stringify(ctx.headers)} \nrequest body info: ${JSON.stringify(ctx.request.body)} \nresponse info: ${JSON.stringify(response)} \nerror name: ${e.name} \n`);
            }
            ctx.body = response;
        }
    });
};