'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const Log = require('./log');
const Cors = require('./cors');
const Route = require('./route');
const Filter = require('./filter');
const Format = require('./format');
const Middleware = require('./middleware');

module.exports = (config) => {
    assert(config && config.port && config.path, 'app config is wrong'); 
    const app = new Koa(config);
    //默认已使用Nginx代理(设置X-Forwarded-For)
    app.proxy = config.hasOwnProperty('proxy') ? Boolean(config.proxy) : true;
    //默认在程序中处理cors, 若在nginx层处理跨域, 可关闭该选项
    if (! config.hasOwnProperty('cors') || config.cors) app.use(Cors(config));
    //文件托管
    if (config.static) {
        let staticPath = path.join(config.path, 'public', config.subpath || '');
        if (! fs.existsSync(staticPath)) fs.mkdirSync(staticPath, {recursive: true});
        config.STATIC_PATH = staticPath;
        app.use(require('koa-static')(staticPath));
    }
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
    app.on('error', (err) => {
        global.Log.error('server error' + err.message || String(err));
    });

    //创建HTTP服务
    let server = null;
    if (config.protocol === 'https') {
        assert(config.ssl_key && config.ssl_cert, 'https ssl file path undefined');
        server = https.createServer({
            key: fs.readFileSync(config.ssl_key),
            cert: fs.readFileSync(config.ssl_cert)
        }, app.callback());
    } else {
        server = http.createServer(app.callback());
    }
    const port = Number(config.port);
    //默认只监听本地Nginx转发请求
    const host = config.outside ? '0.0.0.0' : '127.0.0.1';
    server.listen(port, host);
    global.Log.warn('Server Listening HTTP On port:' + port);
    return {app, server};
};
