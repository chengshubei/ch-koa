'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const Config = require('./config');
const Log = require('./log');
const Cors = require('./cors');
const Route = require('./route');
const Filter = require('./filter');
const Format = require('./format');
const Middleware = require('./middleware');

module.exports = (config) => {
    //检查配置
    config = Config(config);
    const app = new Koa(config);
    //跨域处理
    if (config.cors) app.use(Cors(config));
    //文件托管
    if (config.static) app.use(require('koa-static')(config.STATIC_PATH));
    //解析请求消息, 文件上传需自行处理
    app.use(bodyParser());
    //配置日志
    Log(app, config);
    //格式化请求和响应
    Format(app, config);
    //注册过滤器
    Filter(app, config);
    //注册中间件
    Middleware(app, config);
    //注册路由
    Route(app, config);
    //捕捉未处理的异常
    app.on('error', (e) => {
        global.Log.error('server error: ' + e.message || String(e));
        global.Log.error(e.stack);
    });
    const port = Number(config.port);
    //默认只监听本地Nginx转发请求
    const host = config.outside ? '0.0.0.0' : '127.0.0.1';
    const server = app.listen(port, host);
    global.Log.warn('Server Listening HTTP On port:' + port);
    return {app, server};
};
