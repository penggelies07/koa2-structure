import fs from 'fs'
import path from 'path'
import formatUtils from './formatUtils'

// 递归读取目录所有文件路径，包括子目录
function readDirRecursive (dir) {
  let files = []
  try {
    const stats = fs.statSync(dir)
    if (!stats.isDirectory()) throw new Error()
  } catch (err) {
    return files
  }
  fs.readdirSync(dir).forEach((filename) => {
    const d = path.join(dir, filename)
    if (fs.statSync(d).isDirectory()) {
      files = files.concat(readDirRecursive(d))
    } else {
      files.push(d)
    }
  })
  return files
}

// 读取目录下所有文件名，不包括字幕了
function readFiles (dir, extension) {
  const files = []
  try {
    const stats = fs.statSync(dir)
    if (!stats.isDirectory()) throw new Error()
  } catch (err) {
    return files
  }
  fs.readdirSync(dir).forEach((filename) => {
    if (fs.statSync(path.join(dir, filename)).isDirectory()) return
    if (extension && !(new RegExp('(' + extension + ')$').test(filename))) return
    files.push(filename)
  })
  return files
}

// 注入services到app，可在路由中使用 $serviceNname 方式引用
// 仅注入该路径根目录下的js文件，要求这些文件导出一个object
exports.injectServices = function (app, servicesPlace, prefix) {
  prefix = prefix || '$'
  readFiles(servicesPlace, '.js')
    .forEach((filename) => {
      const name = formatUtils.removeExtension(filename)
      app.context[prefix + formatUtils.camelize(name)] = require(path.join(servicesPlace, filename))
    })
}

// 注入routes到router
// 注入该目录包括子目录所有文件，要求这些文件导出一个函数，如：function(router){}
exports.injectRoutes = function (router, routesPlace) {
  readDirRecursive(routesPlace).forEach((file) => {
    require(file)(router)
  })
}

function packBody (success, data, code) {
  let res = {success, code}
  if (typeof data === 'string') res.msg = data
  else if (typeof data === 'object') res = Object.assign(res, data)
  return res
}

// 封装正确形式的响应体
exports.success = function (data, code) {
  return (this.body = packBody(true, data, code))
}

// 封装错误形式的响应体
exports.fail = function (msg, code) {
  return (this.body = packBody(false, msg, code))
}

// 用于koa-validate验证，封装并抛出错误信息
exports.check = function () {
  const errors = this.errors
  if (!errors) return
  const error = errors[0]
  const msg = error[Object.keys(error)[0]]
  this.throw(msg)
  return msg
}
