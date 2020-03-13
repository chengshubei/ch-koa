'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = (config = {}) => {
    const projectPath = config.path || path.join(__dirname, '..', '..');
    const subpath = config.subpath || '';
    const Config = _.merge({
        port: 6001,
        path: projectPath,
        subpath: subpath,
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
        resources: {},
        tasks: [],
        middlewares: [],
        static: false,
        i18n: false,
        maintenance: false,
        ips: [],
        unips: [],
        closes: [],
        CONTROLLER_PATH: path.join(projectPath, 'controllers', subpath),
        TASK_PATH: path.join(projectPath, 'tasks', subpath),
        MIDDLEWARE_PATH: path.join(projectPath, 'middlewares', subpath),
        ROUTE_PATH: path.join(projectPath, 'routes', subpath),
        MESSAGE_PATH: path.join(projectPath, 'messages', subpath),
        LOG_PATH: path.join(projectPath, 'logs', subpath),
        STATIC_PATH: path.join(projectPath, 'public', subpath),
    }, config);

    //初始化路径
    if (Config.static && ! fs.existsSync(Config.STATIC_PATH)) fs.mkdirSync(Config.STATIC_PATH, {recursive: true});
    if (Config.log && ! fs.existsSync(Config.LOG_PATH)) fs.mkdirSync(Config.LOG_PATH, {recursive: true});
    return Config;
};