'use strict';

const {ForbiddenError, UnavailableError, MaintainError} = require('ch-error');

//检测IP白名单
let checkIP = (ctx, ipList) => {
    if (! ipList || ! Array.isArray(ipList) || ipList.length === 0) return;
    if (! ctx.ip) throw new ForbiddenError('IP Forbidden');
    let clientIP = ctx.ip;
    if (clientIP.substr(0, 7) === '::ffff:') clientIP = clientIP.substr(7);
    if (! ipList.includes(clientIP)) throw new ForbiddenError('IP Forbidden');
};

//检测IP黑名单
let checkForbiddenIP = (ctx, ipList) => {
    if (! ipList || ! Array.isArray(ipList) || ipList.length === 0) return;
    if (! ctx.ip) throw new ForbiddenError('IP Forbidden');
    let clientIP = ctx.ip;
    if (clientIP.substr(0, 7) === '::ffff:') clientIP = clientIP.substr(7);
    if (ipList.includes(clientIP)) throw new ForbiddenError('IP Forbidden');
};

//检测服务关闭接口
let checkClosed = (ctx, closes) => {
    if (! closes || ! Array.isArray(closes) || closes.length === 0) return;
    if (closes.includes(ctx.path)) throw new UnavailableError();
};

module.exports = (app, config) => {
    app.use((ctx, next) => {
        if (config.maintenance) throw new MaintainError();
        if (config.ips) checkIP(ctx, config.ips);
        if (config.unips) checkForbiddenIP(ctx, config.unips);
        if (config.closes) checkClosed(ctx, config.closes);
        return next();
    });
};