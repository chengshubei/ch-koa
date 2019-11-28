'use strict';

const path = require('path');
const {BaseError, SystemError, NotFoundError} = require('ch-error');

function create(statusCode = -1, message, error, data) {
    if (isNaN(Number(statusCode))) throw new SystemError('Status code not a number');
    let result = {};
    result.code = statusCode;
    result.data = data || null;
    result.message = message ? String(message) : '';
    result.error = error || '';
    return result;
};
function success(data, message) {
    let result = {};
    result.code = 200;
    result.data = data || null;
    result.message = message || 'OK';
    result.error = '';
    return result;
};

module.exports = (app, config) => {
    app.use(async (ctx, next) => {
        try {
            ctx.body = success();
            await next();
        } catch (e) {
            const Log = global.Log;
            if (! (e instanceof BaseError)) {
                Log.error(`${ctx.path} request operate an no-base-error, name: ${e.name}, message: ${e.message}`);
                Log.error(e.stack);
                e = new SystemError(e.message || String(e));
            } else if (e instanceof SystemError) {
                Log.error(`${ctx.path} request operate a system Error: ${e.error}`);
                Log.error(e.stack);
            } else if (e instanceof NotFoundError) {
                Log.warn(`recv 404 request, path: ${ctx.path}, method: ${ctx.method}`);
            }

            if (config.i18n && ctx.get('lang') && ctx.get('lang') !== 'zh_CN') {
                let messagePath = path.join(config.path, 'message', config.subpath || '', ctx.get('lang'));
                e.message = require(messagePath)[e.code] || e.message;
            }
            let response = create(e.code, e.message, e.error, e.data);
            if (config.debug) {
                Log.warn(`*************DEBUG**************** \ntime: ${new Date().toLocaleString()}, ${ctx.url} operate ${ctx.method} request failed \nheader info: ${JSON.stringify(ctx.headers)} \nrequest body info: ${JSON.stringify(ctx.request.body)} \nresponse info: ${JSON.stringify(response)} \nerror name: ${e.name} \n`);
            }
            ctx.body = response;
        }
    });
};