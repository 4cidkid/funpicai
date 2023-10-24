const path = require('path');
const rootPath = path.dirname(path.dirname(__filename));

module.exports = {
    apps: [
        {
            name: 'funpicai',
            cwd: rootPath,
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            instances: 2,
            exec_mode: 'cluster',
            watch: false,
            merge_logs: true,
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};