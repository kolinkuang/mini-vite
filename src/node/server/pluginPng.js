const {getFileContentByType} = require('../utils/util');

function parsePng(ctx) {
    const {request: {url}} = ctx;
    if (!/.*\.png$/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    getFileContentByType(url, 'image/parsePng', ctx);
}

module.exports = {parsePng};