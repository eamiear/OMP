import request from '@/common/ajax'

export function loginByUsername (username, password) {
  const data = {
    username,
    password
  }
  return request.post({
    url: '/login/login',
    data
  })
}

export function logout () {
  return request.post({
    url: '/login/logout'
  })
}

export function getUserInfo (token) {
  return request.get({
    url: '/user/info',
    params: { token }
  })
}

