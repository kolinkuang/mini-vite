const path = require('path');
const fs = require('fs');

function rewriteImport(content) {
    return content.replace(/from ['"]([^'"]+)['"]/g, (s0, s1) => {
        // start with . ../ /, are all relative path
        if (s1[0] !== '.' && s1[1] !== '/') {
            return `from '/@modules/${s1}'`;
        }
        return s0;
    });
}

function getFileContent(prefix, pathSegments, isToTrim) {
    const filePath = path.resolve(prefix, pathSegments.slice(+!!isToTrim));
    return fs.readFileSync(filePath, 'utf-8');
}

function getFileContentByType(url, type, ctx) {
    const content = getFileContent(process.cwd(), url, true);
    ctx.type = type;
    ctx.body = content;
}

module.exports = {
    rewriteImport,
    getFileContent,
    getFileContentByType
};