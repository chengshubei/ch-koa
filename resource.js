'use strict';

module.exports = (app, config) => {
    //挂载全局配置
    global.AppConfig = config;
    //挂载全局资源
    for (let k in config.resources) global[k] = config.resources[k];
    //绑定请求上下文
    app.use((ctx, next) => {
        ctx.AppConfig = config;
        for (let k in config.resources) ctx[k] = config.resources[k];
        return next();
    });
};