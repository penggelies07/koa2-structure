exports.constantize = function (str) {
  return str.replace(/\-/g, '_').toUpperCase()
}

exports.camelize = function (str) {
  return str.replace(/-(\w)/g, (_, w) => {
    return w ? w.toUpperCase() : ''
  })
}

exports.capitalize = function (str) {
  return str.replace(/\w/, (w) => w.toUpperCase())
}

exports.removeExtension = function (str) {
  return str.replace(/\.\w+$/, '')
}
