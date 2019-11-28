#MyKoa

本框架依托于KOA2, 为方便使用, 约定了固定的目录结构：

├─bin
├─config
├─logics
│  ├─application
│  ├─command
│  ├─common
│  ├─manager
│  └─script
├─message
├─middlewares
│  ├─application
│  └─manager
├─models
├─routes
│  ├─application
│  └─manager
├─logs
│  ├─application
│  └─manager

*****************************************************************
## 配置实例

```
{
    port: null,                         //对外监听端口(必选)
    path: null,                         //项目根目录(必选)
    subpath: null,                      //应用子目录(默认:null, 没有子目录)
    proxy: true,                        //是否使用反向代理(默认:true)
    protocol: 'http'                    //监听协议(默认:http, 可更换为https)
    ssl_key: null,                      //https证书key
    ssl_cert: null,                     //https证书cert
    cors: true,                         //是否在程序中处理跨域(默认: true)
    origin: null,                       //是否限制请求来源(默认:false, '*'。支持完整域名, 二级域名*匹配, 域名数组)
    outside: false,                     //是否接收外部请求(默认:false, 只监听:127.0.0.1)
    log: {                              //日志配置(默认:按日分割日志文件, 保存30天。可以设置为false,只在控制台打印,不保存文件)
        logName: 'app',                 //文件名(默认:app.log和app-error.log, 若用pm2集群发布, 将自动按集群编号标记分开保存, eg: app-1.log)
        isCompress: false,              //历史是否压缩(默认:false, 不压缩。若日志产生较多,建议设置true,对历史日志进行压缩保存)
        keepDays: 30                    //历史日志保存天数(默认:30)
    }
    debug: false,                       //是否开启调试模式(默认:false)
    i18n: false,                        //是否支持国际化(默认:false)
    static: false,                      //是否支持文件托管(默认:false, 开启需安装koa-static)
    maintenance: false,                 //是否系统维护中(默认:false)
    ips: null,                          //客户端IP白名单(默认:null, 无限制)
    unips: null,                        //客户端IP黑名单(默认:null, 无限制)
    closes: null,                       //关闭的路由服务(默认:null, 都可访问)
    prefix: null,                       //路由前缀
    middlewares: [{                     //中间件配置(默认:null, 无中间件, 多个中间件按配置顺序挂载)
        file: 'token',                      //中间件文件名(必选)
        switch: true,                       //中间件开关(默认:false, 中间件不生效)
        TokenName: 'Auth-Token'             //中间件参数(可选)
    }]
}
```

*******************************************************************************