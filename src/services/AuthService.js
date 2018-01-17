import {User} from '../models'
const sequelize = require('sequelize')
const config = require('../config')
const md5 = require('md5')
// const _ = require('lodash')

/**
 * 检测用户名是否存在
 * @param  {[type]}  username [description]
 * @return {Promise}          [description]
 */
exports.isRepeat = async (username) => {
  let isRepeat = await User.findAll({
    attributes: [[sequelize.fn('COUNT', sequelize.col('username')), 'num']],
    where: {username}
  })

  isRepeat = isRepeat[0].dataValues.num > 0 ? 1 : 0

  return isRepeat
}

/**
 * 将密码进行md5加密
 * @param  {[type]}  password [description]
 * @return {Promise}          [description]
 */
exports.secretMD5 = async (password) => {
  let str = config.secret.str

  let tar = password + '&' + str + '&penggelie'

  let sertMD5 = md5(tar)

  return sertMD5
}
