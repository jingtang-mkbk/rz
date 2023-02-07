import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const TimestampKey = 'vue_admin_template_stamp'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getTimestamp() {
  return Cookies.get(TimestampKey)
}

export function setTimestamp(token) {
  return Cookies.set(TimestampKey, Date.now())
}

export function removeTimestamp() {
  return Cookies.remove(TimestampKey)
}
