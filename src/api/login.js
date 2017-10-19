/**
 * Created by skz
 * Login Service
 */

import request from '@/common/ajax'
import { fetchUserInfo } from './system/user'

export function loginByUsername (username, password) {
  // TODO data
  const data = {
    loginType: 2,
    sysId: 5,
    account: username,
    password
  }
  return request.post({
    // url: '/login',
    reqMethod: 'account.operator.login.doLogin',
    params: data
  })
}

export function logout (accessToken) {
  return request.post({
    // url: '/logout',
    reqMethod: 'account.operator.login.loginOut',
    params: {accessToken}
  })
}

export function getUserInfo (uid, accessToken) {
  // return request.get({
  //   // url: 'findUserInfo',
  //   reqMethod: 'operation.user.getOprUserByUid',
  //   params: { uid, accessToken }
  // })
  return fetchUserInfo(uid)
}

export function reNewAcessToken (oldAccessToken) {
  return request.post({
    reqMethod: 'account.operator.login.renewToken',
    params: {accessToken: oldAccessToken}
  })
}

