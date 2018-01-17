import {User} from '../models'
const jwt = require('jsonwebtoken')
const $auth = require('../services/auth')

module.exports = function (router) {
  /**
   * 注册用户信息
   * @param  {[type]} async [username]
   * @param  {[type]} async [password]
   * @param  {[type]} async [realname]
   * @return {[type]}       [user]
   */
  router.post('/user/regist', async (ctx) => {
    ctx.checkBody('username').notEmpty('请输入您的用户名！')
    ctx.checkBody('password').notEmpty('请输入您的密码！')
    ctx.checkBody('realname').notEmpty('请输入您的真实姓名！')
    ctx.check()

    let username = ctx.request.body.username
    let password = ctx.request.body.password
    let realname = ctx.request.body.realname

    if (password.length < 6) throw new Error('输入密码小于六位')
    password = await $auth.secretMD5(ctx.request.body.password)

    let createdAt = new Date()
    let user = null

    try {
      user = await User.create({username, password, realname, createdAt})
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        ctx.fail('该用户名已存在！', 500)
        return
      }
    }

    ctx.success({user})
  })

  // router.post('user/registByQQ', async (ctx) => {
  //
  // })

  /**
   * 用户通过账号密码登录
   * @param  {[type]} async [username]
   * @param  {[type]} async [password]
   * @return {[type]}       [token]
   */
  router.post('/user/login', async (ctx) => {
    ctx.checkBody('username').notEmpty('请输入您的用户名！')
    ctx.checkBody('password').notEmpty('请输入您的密码！')
    ctx.check()

    let username = ctx.request.body.username
    let password = ctx.request.body.password

    password = await $auth.secretMD5(ctx.request.body.password)

    let user = await User.findOne({
      where: {
        username,
        password
      },
      attributes: {
        exclude: ['password']
      }
    })

    if (!user) throw new Error('用户名或密码有误，请重新输入！')

    let token = jwt.sign({username, userId: user.id, loginAt: new Date()}, ctx.config.jwt.secret)

    ctx.success({token, userId: user.id})
  })
}
