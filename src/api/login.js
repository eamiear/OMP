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
    reqMethod: 'account.login.doLogin',
    params: data
  })
}

export function logout (accessToken) {
  return request.post({
    reqMethod: 'account.login.loginOut',
    params: {accessToken}
  })
}

export function getUserInfo (uid) {
  return request.post({
    reqMethod: 'account.user.findByUid',
    params: { uid }
  })
}

export function reNewAcessToken (oldAccessToken) {
  return request.post({
    reqMethod: 'account.login.renewToken',
    params: {accessToken: oldAccessToken}
  })
}

