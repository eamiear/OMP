import request from '@/common/ajax'

export function loginByUsername (username, password) {
  // TODO
  const data = {
    loginType: 2,
    clientType: 5,
    account: username,
    password
  }
  return request.post({
    url: '/login',
    reqMethod: 'operation.login.doLogin',
    params: data
  })
}

export function logout (accessToken) {
  return request.post({
    url: '/logout',
    reqMethod: 'operation.login.loginOut',
    params: {accessToken}
  })
}

export function getUserInfo (uid, accessToken) {
  return request.get({
    url: 'findUserInfo',
    reqMethod: 'operation.user.getOprUserByUid',
    params: { uid, accessToken }
  })
}

export function reNewAcessToken (oldAccessToken) {
  return request.post({
    reqMethod: 'account.login.renewToken',
    params: {accessToken: oldAccessToken}
  })
}

