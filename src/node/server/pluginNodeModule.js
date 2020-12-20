const path = require('path');
const {getFileContent, rewriteImport} = require('../utils/util');

function parseNodeModule(ctx) {
    const {request: {url}} = ctx;
    if (!/^\/@modules\/.*/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    // this is all inside one node_modules
    const prefix = path.resolve(process.cwd(), 'node_modules', ctx.url.replace('/@modules/', ''));
    const module = require(prefix + '/package.json').module;
    const content = getFileContent(prefix, module);
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(content);
}

module.exports = {parseNodeModule};