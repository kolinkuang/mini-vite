const path = require('path');
const fs = require('fs');
const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');
const {rewriteImport} = require('../utils/util');

function parseSingleVue(ctx) {
    const {request: {url, query}} = ctx;
    if (!/\.vue/.test(url)) {
        return;
    }

    console.log(`Parsing ${url}`);

    // vue single file component
    const p = path.resolve(process.cwd(), url.split('?')[0].slice(1));
    const {descriptor} = compilerSfc.parse(fs.readFileSync(p, 'utf-8'));
    if (query.type === 'template') {
        // 模板内容
        const {template} = descriptor;
        // 要在 server 端把 compiler 做了
        const render = compilerDom.compile(template.content, {mode: 'module'}).code;
        ctx.type = 'application/javascript';
        ctx.body = rewriteImport(render);

    } else if (!query.type) {
        ctx.type = 'application/javascript';
        // 借用 vue 自导的 compile 框架，解析单文件组件，其实相当于 vue-loader 做的事情
        ctx.body = `
                // option 组件
                ${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))};
                import { render as __render } from "${url}?type=template";
                __script.render = __render;
                export default __script;
            `;
    }
}

module.exports = {parseSingleVue};