import request from '@/common/ajax'

export function userSearch (name) {
  return request.get({
    url: '/search/user',
    params: { name }
  })
}
