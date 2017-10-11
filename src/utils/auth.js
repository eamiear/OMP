import Cookies from 'js-cookie'
import { AUTHORITY_KEY } from '@/common/constants'
const TokenKey = 'Admin-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getAuthorityInfo () {
  return Cookies.get(AUTHORITY_KEY)
}

export function setAuthorityInfo (authInfo) {
  return Cookies.set(AUTHORITY_KEY, authInfo)
}

export function removeAuthorityInfo () {
  return Cookies.remove(AUTHORITY_KEY)
}
