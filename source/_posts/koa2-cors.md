---
title: koa2-cors
date: 2021-04-22 10:38:28
tags:
  - 跨域
categories:
  - Node.js

---
### koa2-cors配置
``` js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); //post数据处理
const router = require('koa-router')(); //路由模块

const cors = require('koa2-cors'); //跨域处理
const app = new Koa();
app.use(
    cors({
        origin: function(ctx) { //设置允许来自指定域名请求
            if (ctx.url === '/test') {
                return '*'; // 允许来自所有域名请求
            }
            return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie  当客户端使用 withCredentials: true时，必须配置
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);
router.post('/', async function (ctx) {
    ctx.body = '请求成功了'
});

app.listen(3000);

```