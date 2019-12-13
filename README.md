# ch-validator

基于Koa2的简单易用的web框架, 代码简单易懂, 欢迎提供建议。 

## Installation

```
$ npm install ch-koa
```

## Example

```
const config = {
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

const ChKoa = require('ch-koa');
ChKoa(config);
```

## Basic Usage
框架提供丰富而实用的配置, 除端口和项目根目录外, 都提供了方便的默认选项, 见上例。  
为了增强易用性, 框架以config.path为基础, 强制固定了部分的目录结构  
    - routes 强制路由目录  
    - logs   强制日志目录  
    - middlewares 强制中间件目录  
    - public 强制静态文件目录  
    - message 强制状态码目录  
controller, config等的代码和目录结构没有限制, 可完全自由定义。  
框架支持在一个项目工程中创建多个服务进程, 通过设置subpath来划分目录, 适合共用数据库和部门逻辑的小型项目或微服务,建议目录如下:  

#### 单应用工程目录建议 (subpath: null)
├─bin  
|   application  
├─config  
|   application.js  
├─controllers  
|   logic1.js  
|   logic2.js  
├─message  
|   en.js  
|   zh-CN.js  
├─middlewares  
|   token.js  
├─models  
|   user.js  
├─routes  
|   user.js  
└─logs  
    app.log  

#### 多应用工程目录建议 (subpath: application/manager)
├─bin  
|   application  
│   manager  
├─config  
|   application.js  
|   manager.js  
├─controllers  
│  ├─application  
|  |    logic1.js  
|  |    logic2.js  
│  └─manager  
|       logic1.js  
|       logic2.js  
├─message  
│  ├─application  
|  |    en.js  
|  |    zh-CN.js  
│  └─manager  
|       en.js  
|       zh-CN.js  
├─middlewares  
│  ├─application  
│  └─manager  
├─models  
|   user.js  
├─routes   
│  ├─application  
|  |    token.js  
│  └─manager  
|       permission.js   
└─logs  
  ├─application  
  |     app.log  
  └─manager  
        manager.log  

#### 友情提示: 
    项目依赖了自己封装的ch-error和ch-validator模块, 请求参数经过validator过滤和格式化后重新组合对象绑定在ctx上。  
    建议在controller中使用ctx.attributes来获取参数, 也可以通过koa原始方式获取原始参数值。  

# License

  MIT
