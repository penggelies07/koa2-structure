export function randomStr (length = 10) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let len = chars.length
  let name = ''

  for (let i = 0; i < length; i++) {
    name += chars[Math.floor(Math.random() * len)]
  }

  return Date.now + name
}