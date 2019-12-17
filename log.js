'use strict';

const path = require('path');
const log4js = require('log4js');

const defaultCfg = {
    appenders: {out: {type: 'stdout'}},
    categories: {default: {appenders: ['out'], level: 'debug'}}
};

function logCfg(config) {
    if ('log' in config && ! config.log) return defaultCfg;
    let logCfg = config.log || {};
    if (! config.LOG_PATH) config.LOG_PATH = path.join(config.path, 'logs', config.subpath || '');
    let fileName = config.LOG_PATH + (logCfg.fileName || 'app');
    let instanceFlag = '';
    if (process.env.instances && process.env.instances > 1) {
        //PM2集群部署, 日志分开保存
        instanceFlag = `-${process.env.NODE_APP_INSTANCE}`;
    }
    return {
        disableClustering: true,
        appenders: {
            file: {
                type: 'file',
                filename: fileName + '-error.log',
                maxLogSize: 52428800, //最大文件大小
                numBackups: 10, //最大保存文件数量
                compress: Boolean(logCfg.isCompress) || false, //历史是否压缩
                keepFileExt: true //日志文件是否保持后缀
            },
            dateFile: {
                type: 'dateFile',
                filename: fileName + instanceFlag,
                pattern: 'yyyy-MM-dd.log',
                compress: Boolean(logCfg.isCompress) || false, //历史日志是否压缩
                alwaysIncludePattern: true, //日志滚动时保留模式yyyy-MM-dd
                keepFileExt: true, //日志滚动时保留文件扩展名
                daysToKeep: logCfg.keepDays || 30 //配置日志文件保存时间
            },
            out: {
                type: 'stdout'
            },
            panicFile: {
                type: 'logLevelFilter', //分级日志
                appender: 'file',
                level: 'error' //触发的最小日志级别     
            }
        },
        categories: {
            default: {
                appenders: ['out', 'dateFile', 'panicFile'],
                level: 'info'
            }
        }
    };
}

module.exports = (app, config) => {
    log4js.configure(logCfg(config));
    let logger = log4js.getLogger('server');
    global.Log = logger;
    //路由加载日志方法
    app.use((ctx, next) => {
        ctx.Log = log4js.getLogger(ctx.path);
        return next();
    });
};