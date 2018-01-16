import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV || 'dev'
const config = {env}

const root = path.join(__dirname, env)

const _config = fs.readdirSync(root)
  .reduce((_config, filename) => {
    const key = filename.replace(/\.js$/, '')
    _config[key] = require(path.join(root, filename))
    return _config
  })

module.export = Object.assign(config, _config)
