import Koa from 'koa'
import path from 'path'
import fs from 'fs'
import json from 'koa-json'
import kcors from 'kcors'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import koaValidate from 'koa-validate'
import logger from 'koa-logger'
import onerror from 'koa-onerror'
import formidable from 'formidable'
import config from './config'
import koaUtils from './lib/koaUtils'

const app = new Koa()
app.context.config = config
app.context.success = koaUtils.success
app.context.fail = koaUtils.fail
app.context.check = koaUtils.check

// error handler
onerror(app)

// middlewares
app.use(json())
app.use(logger())
app.use(kcors())
app.use(bodyParser({
  'formLimit': '5mb',
  'jsonLimit': '5mb'
}))
koaValidate(app)

/* services and routes */
const router = new Router()
koaUtils.injectServices(app, path.join(__dirname, 'services'))
koaUtils.injectRoutes(router, path.join(__dirname, 'controllers'))
app.use(router.routes(), router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

app.listen(config.app.port, () => { console.log('Server is listening on %s', config.app.port) })
