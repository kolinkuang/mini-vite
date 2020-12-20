const {getFileContentByType} = require('../utils/util');

function parseIco(ctx) {
    const {request: {url}} = ctx;
    if (!/.*\.ico$/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    getFileContentByType(url, 'image/x-icon', ctx);
}

module.exports = {parseIco};