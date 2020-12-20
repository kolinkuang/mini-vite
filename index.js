const Koa = require('koa');
const app = new Koa();
const {parseHomePage} = require('./src/node/server/pluginHomePage');
const {parseNodeModule} = require('./src/node/server/pluginNodeModule');
const {parseSingleVue} = require('./src/node/server/pluginSingleVue');
const {parseCss} = require('./src/node/server/pluginCss');
const {parseJs} = require('./src/node/server/pluginJs');
const {parsePng} = require('./src/node/server/pluginPng');
const {parseIco} = require('./src/node/server/pluginIco');

app.use(ctx => {

    const resolvedPlugins = [
        parseHomePage,
        parseNodeModule,
        parseSingleVue,
        parseCss,
        parseJs,
        parsePng,
        parseIco
    ];

    resolvedPlugins.forEach(plugin => plugin && plugin(ctx));
});

app.listen(3001, () => console.log('listen to me, 3001 port, up~~'));