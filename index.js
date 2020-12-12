const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();

function _rewriteImport(content) {
    return content.replace(/from ['"]([^'"]+)['"]/g, function (s0, s1) {
        // start with . ../ /, are all relative path
        if (s1[0] !== '.' && s1[1] !== '/') {
            return `from '/@modules/${s1}'`;
        } else {
            return s0;
        }
    });
}

function _getFileContent(prefix, pathSegments, isToTrim) {
    const filePath = path.resolve(prefix, pathSegments.slice(+!!isToTrim));
    return fs.readFileSync(filePath, 'utf-8');
}

app.use(async ctx => {

    const {request: {url, query}} = ctx;

    if (url === '/') {
        // home page
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

    } else if (url.startsWith('/@modules/')) {
        // this is all inside one node_modules
        const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''));
        const module = require(prefix + '/package.json').module;
        const content = _getFileContent(prefix, module);
        ctx.type = 'application/javascript';
        ctx.body = _rewriteImport(content);

    } else if (url.includes('.vue')) {
        // vue single file component
        const p = path.resolve(__dirname, url.split('?')[0].slice(1));
        const {descriptor} = compilerSfc.parse(fs.readFileSync(p, 'utf-8'));
        if (!query.type) {
            ctx.type = 'application/javascript';
            // 借用 vue 自导的 compile 框架，解析单文件组件，其实相当于 vue-loader 做的事情
            ctx.body = `
                // option 组件
                ${_rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))};
                import { render as __render } from "${url}?type=template";
                __script.render = __render;
                export default __script;
            `
        } else if (query.type === 'template') {
            // 模板内容
            const {template} = descriptor;
            // 要在 server 端把 compiler 做了
            const render = compilerDom.compile(template.content, {mode: 'module'}).code;
            ctx.type = 'application/javascript';
            ctx.body = _rewriteImport(render);
        }
    } else {
        let content;
        switch (true) {
            case /.*\.css/.test(url):
                content = _getFileContent(__dirname, url, true);
                const newContent = `const css = "${content.replace(/\n/g, '')}"
                    let link = document.createElement('style')
                    link.setAttribute('type', 'text/css')
                    link.innerHTML = css
                    document.head.appendChild(link)
                    export default css`;

                ctx.type = 'application/javascript';
                ctx.body = newContent;
                break;

            case /.*\.js/.test(url):
                content = _getFileContent(__dirname, url, true);
                ctx.type = 'application/javascript';
                ctx.body = _rewriteImport(content);
                break;

            case /.*\.png/.test(url):
                content = _getFileContent(__dirname, url, true);
                ctx.type = 'image/png';
                ctx.body = content;
                break;

            case /.*\.ico/.test(url):
                content = _getFileContent(__dirname, url, true);
                ctx.type = 'image/x-icon';
                ctx.body = content;
                break;

            default:
                return;
        }
    }
});

app.listen(3001, () => console.log('listen to me, 3001 port, up~~'));