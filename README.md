# ch-koa

基于Koa2的简单易用的web框架, 对常用的基础需求，进行了封装和配置. 
代码简单易懂, 配合ch-validaor和ch-error使用, 欢迎提交issue.

## Installation

```
$ npm install ch-koa
```

## 配置和使用

```
const config = {
    port: 6000,                 //对外监听端口(默认:6000)
    path: '.',                  //项目根目录(默认:node_modules同级目录)
    subpath: '',                //应用子目录(默认:'', 没有子目录)
    proxy: true,                //是否使用反向代理(默认:true, 通过X-Forwarded-For获取客户端ip, 前面需配合Nginx)
    outside: false,             //是否接收外部请求(默认:false, 只监听:127.0.0.1)
    prefix: null,               //通用路由前缀(默认:'')
    debug: false,               //是否开启调试模式(默认:false. 设置true, 记录每条错误请求)
    cors: {                     //是否在程序中处理跨域(默认:全过. 可以设置为false, 在Nginx中处理)
        origin: '*',                //是否限制请求来源(默认:'*'. 可以支持多个域名, 以逗号隔开)
        maxAge: 3600                //options检测过期时间(默认:3600秒)
    },
    log: {                      //日志配置(默认:保存文件. 可设置为false, 只在控制台打印, 不保存文件)
        fileName: 'app',            //文件名(默认:产生普通日志按日保存文件app.2019-12-14.log和异常日志文件app-error.log.
                                    若用pm2集群发布, 普通日志将自动按集群编号标记分开保存, eg: app-1.2019-14-14.log)
        isCompress: false,          //历史是否压缩(默认:false, 不压缩. 若日志产生较多, 建议设置true, 对历史日志进行压缩保存)
        keepDays: 30                //历史日志保存天数(默认:30)
    },
    middlewares: [{             //中间件配置(默认:[], 无中间件. 多个中间件按配置顺序挂载)
        file: 'token',              //中间件文件名(必选)
        switch: true,               //中间件开关(默认:true)
        TokenName: 'Auth-Token'     //中间件参数(可选)
    }],
    static: false,              //是否支持静态文件托管(默认:false)
    i18n: false,                //是否支持国际化提示(默认:false, 只支持返回程序中new ch-error中的填写的message错误提示. 
                                目录内文件名应与请求头中lang字段设置的语言标识相同, eg: en.js.
                                多语言模块要求返回状态码对应提示, eg: module.exoprts = {15001: 'password error'}).
    maintenance: false,         //是否系统维护中(默认:false)
    ips: [],                    //访问IP白名单(默认:[], 无限制)
    unips: [],                  //访问IP黑名单(默认:[]], 无限制)
    closes: [],                 //关闭的路由服务(默认:[], 都可访问)
    ROUTE_PATH: 'path/routes[/subpath]',            //默认路由目录, 可修改
    MIDDLEWARE_PATH: 'path/middlewares[/subpath]',  //默认中间件目录, 可修改
    MESSAGE_PATH: 'path/messages[/subpath]',        //默认国际化提示目录, 可修改
    LOG_PATH: 'path/logs[/subpath]',                //默认日志目录, 可修改
    STATIC_PATH: 'path/public[/subpath]'            //默认静态文件托管目录, 可修改
};

const ChKoa = require('ch-koa');
ChKoa(config);
global.Log.warn(global.Config); //全局对象下将自动挂载 Log日志句柄和Config完整配置
```

#### 路由文件示例

```
module.exports = {
    prefix: '',         //模块路由前缀(默认:'', 无前缀)
    routes: [           //路由列表(默认:[], 无路由)
        {
            description: '',    //资源描述(默认:'')
            path: '',           //请求路径(默认:'/')
            method: '',         //请求方法(必填项, 支持get,post等标准方法)
            validator: {        //参数验证(默认:null. 依赖"ch-validator"模块, 欢迎提供意见,下为举例)
                'id': ['用户编号', 'required', 'integer', {'min': 1000}],
                'school': ['学校', 'string', {'default': '杭州学军中学'}]
            },
            controller: async (ctx) => {
                ctx.body.data = '感谢您对本项目的信赖和支持';
            }
        }
    ]
};
```

## 项目特色

1. 框架封装了丰富而实用的配置, 并提供了方便的默认选项, 见上例。 
2. 项目依赖很少, 代码简单清晰, 便于阅读和理解。
3. 路由模块进行了封装, 并集成了简洁的参数验证工具, 代码即文档, 后期版本更可能以此为基础加入自动生成接口文档功能。
4. 简洁而实用的ch-validator参数验证模块, 合并了get和post参数, 在controller中推荐使用ctx.attributes来获取参数。
5. 支持多应用功能, 通过subpath和默认目录, 在一个工程中可以方便的配置多个应用, 适合共用数据库的微服务使用, 见下例。
6. 集成了log4js的实用配置, 并提供了debug开关, 开启时完整记录每一个返回失败(code !== 200)的请求详情。
7. 方便的自定义中间件功能, 通过配置顺序确定先后调用。
8. 提供了一键维护中, 关闭路由, 黑白名单, 格式化返回结果, 提示国际化等实用功能
9. 框架经过公司核心项目的长时间运行, 可靠性A+。 
10. 以实用和简洁为指导思想, 欢迎提交issue和想法, 合理即修改, 并且保证向前兼容。

#### 单应用工程目录建议 (subpath: null)
```
├── bin
│   └── application
├── config
│   └── application.js
├── controllers
│   └── logic.js
├── messages
│   └── en.js
├── middlewares
│   └── token.js
├── models
│   └── user.js
├── routers
│   └── user.js
├── logs
│   └── app.log
``` 

#### 多应用工程目录建议 (subpath: application/manager)
```
├── bin
|   ├── application
│   └── manager
├── config
|   ├── application.js
│   └── manager.js
├── controllers
|   ├── application
│   │   └── logic.js
│   └── manager
│       └── logic.js
├── messages
|   ├── application
│   │   └── en.js
│   └── manager
│       └── en.js
├── middlewares
|   ├── application
│   │   └── token.js
│   └── manager
│       └── permission.js
├── models
│   └── user.js
├── routers
|   ├── application
│   │   └── user.js
│   └── manager
│       └── admin.js
├── logs
|   ├── application
│   │   └── app.log
│   └── manager
│       └── manager.log
```


#### 友情提示

项目依赖了自己封装的ch-error和ch-validator模块, 同样欢迎提供意见。

## Questions & Suggestions

Please open an issue [here](https://github.com/chengshubei/ch-koa/issues).

# License

  MIT
