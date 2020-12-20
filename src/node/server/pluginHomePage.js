const fs = require('fs');

function parseHomePage(ctx) {
    const {request: {url}} = ctx;
    if (!/^\/$/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    let content = fs.readFileSync('./index.html', 'utf-8');
    content = content.replace('<script', `
            <script>
                window.process = window.process || {};
                window.process.env = {};
                window.process.env.NODE_ENV = 'production';
            </script>
            <script
        `);
    ctx.type = 'text/html';
    ctx.body = content;
}

module.exports = {parseHomePage};