'use strict';

const path = require('path');
const log4js = require('log4js');

module.exports = (app, config) => {
    if (! config.log) {
        let Log = log4js.getLogger('logger');
        Log.level = 'debug';
        global.Log = Log;
        app.use((ctx, next) => {
            ctx.Log = log4js.getLogger(ctx.path);
            return next();
        });
    } else {
        let fileName = path.join(config.path, config.subpath || '', config.logName || 'app');
        if (process.env.instances && process.env.instances > 1) {
            //PM2集群部署, 日志分开保存
            fileName = `${fileName}-${process.env.NODE_APP_INSTANCE}`;
        }
        let options = {
            disableClustering: true,
            appenders: {
                file: {
                    type: 'file',
                    filename: fileName + '-error.log',
                    maxLogSize: 52428800, //最大文件大小
                    numBackups: 10, //最大保存文件数量
                    compress: Boolean(config.isCompress) || false, //历史是否压缩
                    keepFileExt: true //日志文件是否保持后缀
                },
                dateFile: {
                    type: 'dateFile',
                    filename: fileName,
                    pattern: 'yyyy-MM-dd.log',
                    compress: Boolean(config.isCompress) || false, //历史日志是否压缩
                    alwaysIncludePattern: true, //日志滚动时保留模式yyyy-MM-dd
                    keepFileExt: true, //日志滚动时保留文件扩展名
                    daysToKeep: config.keepDays || 30 //配置日志文件保存时间
                },
                out: {
                    type: 'stdout'
                }
            },
            categories: {
                //运行日志
                default: {
                    appenders: ['dateFile', 'out'],
                    level: 'info'
                },
                //崩溃日志
                crash: {
                    appenders: ['file'],
                    level: 'error'
                }
            }
        };
        log4js.configure(options);

        class Logger {
            constructor(category) {
                this.logger = log4js.getLogger(category);
                this.errLogger = log4js.getLogger('crash');
            }
            info(msg) {
                this.logger.info(msg);
            }
            warn(msg) {
                this.logger.info(msg);
            }
            error(msg) {
                this.logger.info(msg);
                //异常的日志, 在file中单独保存一份,永久保存
                this.errLogger.error(msg);
            }
        }
        let Console = new Logger('server');
        global.Log = Console;
        //保存console日志
        console.log = Console.info;
        console.warn = Console.warn;
        console.error = Console.error;
        
        app.use((ctx, next) => {
            //只能使用 info, warn, error 三种打印方法
            ctx.Log = new Logger(ctx.path);
            return next();
        });
    }
};