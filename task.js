'use strict';

const path = require('path');

module.exports = (config) => {
    if (config.tasks.length > 0) {
        for (let t of config.tasks) {
            if (!('switch' in t) || t.switch) {
                if (!('single' in t) || t.single) {
                    if (process.env.instances && process.env.instances > 1) {
                        //PM2集群部署, 只选择NODE_APP_INSTANCE=0的进程执行
                        if (process.env.NODE_APP_INSTANCE > 0) continue;
                    }
                }
                let file = path.join(config.MIDDLEWARE_PATH, t.file);
                require(file)(t);
            }
        }
    }
};