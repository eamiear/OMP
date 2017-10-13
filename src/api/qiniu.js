import fetch from '@/common/fetch'

export function getToken () {
  return fetch({
    url: '/qiniu/upload/token',
    method: 'get'
  })
}
