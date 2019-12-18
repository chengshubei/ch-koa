'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = (config) => {
    assert(config && typeof config === 'object', 'ChKoa 配置对象为空');
    assert(Number(config.port), '监听端口(port)未配置');
    assert(config.path, '项目根目录(path)未配置');
    let mergeConfig = _.merge({
        subpath: '',
        proxy: true,
        outside: false,
        debug: false,
        cors: {
            origin: '*',
            maxAge: 3600
        },
        log: {
            fileName: 'app',
            isCompress: false,
            keepDays: 30 
        },
        middlewares: [],
        static: false,
        i18n: false,
        maintenance: false,
        ips: [],
        unips: [],
        closes: [],
    }, config);
    if (! mergeConfig.ROUTE_PATH) mergeConfig.ROUTE_PATH = path.join(mergeConfig.path, 'routes', mergeConfig.subpath);
    if (! mergeConfig.MIDDLEWARE_PATH) mergeConfig.MIDDLEWARE_PATH = path.join(mergeConfig.path, 'middlewares', mergeConfig.subpath);
    if (! mergeConfig.MESSAGE_PATH) mergeConfig.MESSAGE_PATH = path.join(mergeConfig.path, 'messages', mergeConfig.subpath);
    if (! mergeConfig.LOG_PATH) mergeConfig.LOG_PATH = path.join(mergeConfig.path, 'logs', mergeConfig.subpath);
    if (! mergeConfig.STATIC_PATH) mergeConfig.STATIC_PATH = path.join(mergeConfig.path, 'public', mergeConfig.subpath);
    //绑定全局变量
    global.Config = mergeConfig;
    //初始化路径
    if (mergeConfig.static && ! fs.existsSync(config.STATIC_PATH)) fs.mkdirSync(config.STATIC_PATH, {recursive: true});
    if (mergeConfig.log && ! fs.existsSync(config.LOG_PATH)) fs.mkdirSync(config.LOG_PATH, {recursive: true});
    return mergeConfig;
};