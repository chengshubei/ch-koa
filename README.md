# ch-koa

基于Koa2的简单易用的web框架, 对常用的基础需求，进行了封装和配置。  
代码简单易懂, 配合ch-validaor和ch-error使用, 欢迎提交issue。  
跪求小星星😂😂😂😂😂😂😂  

## Installation

```
$ npm install ch-koa
```

## 配置和使用

```
const config = {
    port: 6001,                 //对外监听端口(默认:6001, 可修改)
    path: '.',                  //项目根目录(默认:node_modules同级目录, 可修改)
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
    resources: {Key: Value},    //挂载资源(默认:{}. 系统会在加载中间件, 初始任务和路由之前 将传入的资源挂载到ctx和global对象上.
                                 eg: {Mysql: sequelize}, 再任意地方使用ctx.Mysql.getModel('user')或global.Mysql.query)
    tasks: [{                   //初始任务配置(默认:[], 无任务)
        file: 'token',              //任务文件名(必选)
        switch: true,               //任务开关(默认:true)
        single: true,               //是否开启单任务模式(默认:true, pm2集群部署的时候, 只选择NODE_APP_INSTANCE=0的进程执行)
        AdminID: 1234               //任务自定义参数(可选)
    }],
    middlewares: [{             //中间件配置(默认:[], 无中间件. 多个中间件按配置顺序挂载)
        file: 'token',              //中间件文件名(必选)
        switch: true,               //中间件开关(默认:true)
        TokenName: 'Auth-Token'     //中间件自定义参数(可选)
    }],
    static: false,              //是否支持静态文件托管(默认:false)
    i18n: false,                //是否支持国际化提示(默认:false, 只支持返回程序中new ch-error中的填写的message错误提示. 
                                目录内文件名应与请求头中lang字段设置的语言标识相同, eg: en.js.
                                多语言模块要求返回状态码对应提示, eg: module.exoprts = {15001: 'password error'}).
    maintenance: false,         //是否系统维护中(默认:false)
    ips: [],                    //访问IP白名单(默认:[], 无限制)
    unips: [],                  //访问IP黑名单(默认:[]], 无限制)
    closes: [],                 //关闭的路由服务(默认:[], 都可访问)
    TASK_PATH: 'path/tasks[/subpath]',              //默认初始化任务目录, 可修改可空
    MIDDLEWARE_PATH: 'path/middlewares[/subpath]',  //默认中间件目录, 可修改可空
    CONTROLLER_PATH: 'path/controllers[/subpath]',  //默认控制器(业务逻辑)目录, 可修改可空
    ROUTE_PATH: 'path/routes[/subpath]',            //默认路由目录, 可修改可空
    MESSAGE_PATH: 'path/messages[/subpath]',        //默认国际化提示目录, 可修改可空
    LOG_PATH: 'path/logs[/subpath]',                //默认日志目录, 可修改, 开启若不存在会自动创建
    STATIC_PATH: 'path/public[/subpath]'            //默认静态文件托管目录, 可修改, 开启若不存在会自动创建
};

const ChKoa = require('ch-koa');
ChKoa(config);
global.Log.warn(global.AppConfig); //全局对象下将自动挂载 Log日志句柄和AppConfig完整配置(结构如上)
```

#### 路由文件示例

```
const ctl = global.Controller.user;

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
            controller: ctl.find    //可以使用预先加载的CONTROLLER_PATH中的函数, 当然也可以传入函数。
        }
    ]
};
```

## 框架特色和注意事项

1. 框架以Koa2为基础, 力求**实用**和**简洁**, 封装了丰富而实用的配置, 并提供了方便的默认选项, **见上例**。 
2. 框架会在**最开始**初始化各种配置，并将最终配置(结构如上例)挂载在全局对象上, 以便在项目的任意地方通过 ***global.AppConfig*** 来访问。
3. 框架希望给使用者更多的自由以选择自己喜欢的模块, 尽力减少依赖, 使用者可以将初始化好后的资源配置在 ***resources*** 上。 
    框架将在初始化Config后**立即**对传入的资源在global全局对象和ctx上挂载. eg: {Mysql: sequelize},
    使用者可以在项目的任意地方通过 ***global.Mysql*** 或 ***ctx.Mysql*** 来访问全局统一的资源。
4. 支持初始化任务, 任务执行顺序按照 ***tasks*** 中的配置顺序, 可自由开关, 可访问global.Mysql等全局资源。
    注意: 初始化任务不应返回Promise, 异常需要自己处理。
    框架提供了**single**选项, 并**默认开启**, 在pm2**集群**部署的时候, 只在**NODE_APP_INSTANCE=0**的进程执行, 若关闭则所有进程都执行。
5. 简单的自定义中间件功能，按照 ***middlewares*** 中的配置顺序进行先后调用, 可自由开关, 可访问 ***ctx.Mysql*** 等全局资源。
6. 框架会预先对CONTROLLER_PATH中的js文件进行读取, 不支持嵌套目录, 允许目录为空, 即不绑定公用业务函数。
    文件中的函数可在**路由**中作为处理中间件使用, **见上例**, 函数接收的第一个参数应为ctx句柄。
    文件中函数也可被**初始化任务或中间件**使用, 当然也可以返回非函数变量。
    每个文件读取后, 将挂载在global和ctx对象的Controller上, 并以文件名为key,
    eg: user.js, 可以通过 ***global.Controller.user*** 来访问, 或在controller中使用 ***ctx.Contoller.user***。
    需要**注意**controllers之间互相调用, 推荐使用**require**加载或**ctx.Controller**, 因为文件加载顺序有先后, 
    如果在顶部公共区域使用**global.Controller**来访问变量可能出现访问不到的情况。
7. 框架对路由模块进行了封装，秉承**代码即文档**的设计思想, 后期版本将继承自动生成接口文档功能, 路由结构**见上例**。
8. 路由中引入了好用的参数验证工具(ch-validator), 对参数进行校验,清洗,格式化和合并, 拷贝后重新挂载在ctx上。
     建议在controller中不区分get和post, 通过 ***ctx.attributes*** 来获取参数, 也可以通过koa2原生方式访问原始请求数据。
9. 实用的日志配置, 依赖于log4js, 配合debug开关使用, 开启时完整记录每一个返回失败(code !== 200)的请求详情。
10. 提供一键维护中, 关闭路由, 黑白名单, 格式化返回结果, 提示国际化等实用功能。
11. 支持多应用功能, 通过 **subpath** 和默认目录, 在一个工程中可以方便的配置多个应用, 适合共用数据库的微服务使用。
12. 框架默认目录包括: .(项目根目录), tasks, middlewares, routes, controllers, messages, logs, public, 
    通过对应的config选项都可以进行修改, 不使用的目录允许是不存在的目录。
    logs和public目录不存在时会自动创建, 如不使用可以设置flase关闭相应选项。
13. 框架资源加载顺序: config => resources => controllers => tasks => middlewars => routes。
    绑定(global和ctx)资源的顺序: AppConfig => Mysql/Redis... => Controller。 
14. 推荐工程目录见下。

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
├── tasks
│   └── task.js
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
|   ├── common
│   │   └── common.js
|   ├── application
│   │   └── logic.js
│   └── manager
│       └── logic.js
├── messages
|   ├── application
│   │   └── en.js
│   └── manager
│       └── en.js
├── tasks
|   ├── application
│   │   └── timeout.js
│   └── manager
│       └── everyday.js
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

框架依赖了自己封装的ch-error和ch-validator模块, 同样欢迎提供意见。  
框架依赖很少, 代码简单明晰, 易于阅读和理解。  
框架经过公司核心项目的长时间运行, 可靠性有保证。  
欢迎大家提交issue和想法, 也可联系我的邮箱1246691129@qq.com, 合理的意见都可以修改, 并保证向前兼容。  

## Questions & Suggestions

Please open an issue [here](https://github.com/chengshubei/ch-koa/issues).

# License

  MIT
