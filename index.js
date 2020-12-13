const Koa = require('koa');
const app = new Koa();
const Parser = require('./parser');

app.use(ctx => {

    const {request: {url, query}} = ctx;

    console.log(`Parsing ${url}`);

    switch (true) {
        case /^\/$/.test(url):
            Parser.homePage(url, ctx);
            break;

        case /^\/@modules\/.*/.test(url):
            Parser.nodeModule(url, ctx);
            break;

        case /\.vue/.test(url):
            Parser.singleVue(url, query, ctx);
            break;

        case /.*\.css$/.test(url):
            Parser.css(url, ctx);
            break;

        case /.*\.js$/.test(url):
            Parser.js(url, ctx);
            break;

        case /.*\.png$/.test(url):
            Parser.png(url, ctx);
            break;

        case /.*\.ico$/.test(url):
            Parser.ico(url, ctx);
            break;

        default:
            return;
    }
});

app.listen(3001, () => console.log('listen to me, 3001 port, up~~'));