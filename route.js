'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const validate = require('ch-validator');
const {NotFoundError} = require('ch-error');
const router = require('koa-router')();
const validators = {};

module.exports = (app, config) => {
    let pubPrefix = config.prefix || '';
    let routePath = path.join(config.path, 'routes', config.subpath || '');
    const fls = fs.readdirSync(routePath);
    for (let v of fls) {
        if (v.slice(-3) !== '.js') continue;
        let route = require(path.join(routePath, v));
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
    app.use(router.routes(), router.allowedMethods());
    //404处理
    app.use(() => {throw new NotFoundError();});
};