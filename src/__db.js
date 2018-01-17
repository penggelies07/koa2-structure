'use strict'

const config = require('./config')

/* pgsql connection */
if (config.pgsql) {
  var cls = require('continuation-local-storage')
  var namespace = cls.createNamespace('my-very-own-namespace')

  var Sequelize = require('sequelize')
  Sequelize.cls = namespace

  var sequelize = new Sequelize(config.pgsql.database, config.pgsql.username, config.pgsql.password, {
    host: config.pgsql.host,
    port: config.pgsql.port,
    logging: false,
    dialect: 'postgres'
  })
  global.sequelize = sequelize
  global.Sequelize = Sequelize
}
