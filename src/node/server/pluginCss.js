const {getFileContent} = require('../utils/util');

function parseCss(ctx) {
    const {request: {url}} = ctx;
    if (!/.*\.css$/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    const content = getFileContent(process.cwd(), url, true);
    const newContent = `const css = "${content.replace(/\n/g, '')}"
                    let link = document.createElement('style')
                    link.setAttribute('type', 'text/css')
                    link.innerHTML = css
                    document.head.appendChild(link)
                    export default css`;

    ctx.type = 'application/javascript';
    ctx.body = newContent;
}

module.exports = {parseCss};