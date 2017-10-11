import request from '@/common/ajax'

export function fetchList (query) {
  return request.get({
    url: '/article/list',
    params: query
  })
}

export function fetchArticle () {
  return request.get({
    url: '/article/detail'
  })
}

export function fetchPv (pv) {
  return request.get({
    url: '/article/pv',
    params: { pv }
  })
}

