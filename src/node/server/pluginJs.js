const {getFileContent, rewriteImport} = require('../utils/util');

function parseJs(ctx) {
    const {request: {url}} = ctx;
    if (!/.*\.js$/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    const content = getFileContent(process.cwd(), url, true);
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(content);
}

module.exports = {parseJs};