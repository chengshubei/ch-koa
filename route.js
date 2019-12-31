'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const validate = require('ch-validator');
const {NotFoundError} = require('ch-error');
const router = require('koa-router')();
const validators = {};

module.exports = (app, config) => {
    //挂载资源
    app.use((ctx, next) => {
        for (let k in config.resources) ctx[k] = config.resources[k];
        return next();
    });
    //解析路由配置
    let pubPrefix = config.prefix || '';
    const fls = fs.readdirSync(config.ROUTE_PATH);
    for (let v of fls) {
        if (v.slice(-3) !== '.js') continue;
        let route = require(path.join(config.ROUTE_PATH, v));
        let prefix = route.prefix || '';
        for (let r of route.routes) {
            let rp = `/${pubPrefix}/${prefix}/${r.path}`.replace(/\/{2,}/g, '/');
            let method = r.method.toLowerCase();
            if (r.validator) {
                //注册路由验证器
                let uri = `${method}_${rp}`;
                assert(! validators[uri], `发现重复路由: ${uri}`);
                validators[uri] = r.validator;
            }
            router[method](rp, r.controller);
        }
    }
    //参数校验
    app.use(validate(validators));
    //路由处理
    app.use(router.routes());
    app.use(router.allowedMethods());
    //404处理
    app.use(() => {throw new NotFoundError();});
};