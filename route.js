'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const validate = require('ch-validator');
const {NotFoundError} = require('ch-error');
const router = require('koa-router')();
const validators = {};

module.exports = (app, config) => {
    if (! config.ROUTE_PATH) config.ROUTE_PATH = path.join(config.path, 'routes', config.subpath || '');
    let pubPrefix = config.prefix || '';
    const fls = fs.readdirSync(config.ROUTE_PATH);
    for (let v of fls) {
        if (v.slice(-3) !== '.js') continue;
        let route = require(path.join(config.ROUTE_PATH, v));
        let prefix = route.prefix || '';
        for (let r of route.routes) {
            let rp = `/${pubPrefix}/${prefix}/${r.path}`;
            rp = rp.replace(/\/{2,}/g, '/');
            if (r.validator) {
                //注册路由验证器
                assert(! validators[rp], `find validator repeated route ${path}`);
                validators[rp] = r.validator;
            }
            router[r.method.toLowerCase()](rp, r.controller);
        }
    }
    //参数校验
    app.use((ctx, next) => {
        validate(ctx, validators);
        return next();
    });
    //路由处理
    app.use(router.routes());
    app.use(router.allowedMethods());
    //404处理
    app.use(() => {throw new NotFoundError();});
};