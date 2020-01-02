'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (app, config) => {
    const Controller = {};
    //解析控制器配置
    if (fs.existsSync(config.CONTROLLER_PATH)) {
        const fls = fs.readdirSync(config.CONTROLLER_PATH);
        for (let v of fls) {
            if (v.slice(-3) !== '.js') continue;
            let name = v.slice(0, -3);
            Controller[name] = require(path.join(config.CONTROLLER_PATH, v));
        }
    } else {
        global.Log.warn(`控制器目录${config.CONTROLLER_PATH}不可用, Controller对象未挂载函数.`);
    }
    //挂载资源
    global.Controller = Controller;
    app.use((ctx, next) => {
        ctx.Controller = Controller;
        return next();
    });
};