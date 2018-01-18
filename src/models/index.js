import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import config from '../config'

const _config = config.pgsql

let sequelize
if (_config.use_env_variable) {
  sequelize = new Sequelize(process.env[_config.use_env_variable])
} else {
  sequelize = new Sequelize(_config.database, _config.username, _config.password, _config)
}

const basename = path.basename(module.filename)
let db = {}
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
