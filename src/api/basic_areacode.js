/**
 * Created by skz on 2017/10/911:09
 */

// ===================================
// =========== 基础平台 ===============
// =========== ------- ===============
// ----------- 区域代码 ---------------
// ===================================

import fetch from '@/utils/fetch'

/**
 * 获取区域代码
 * @param query
 */
export function fetchAreaCodeList (query) {
  return fetch({
    url: '/basicplatform/areacode2',
    method: 'get',
    params: query
  })
}

/**
 * TODO 查询区域代码
 * @param query
 */
export function searchAreaCodeList (query) {
  return fetch({
    url: '/',
    method: 'get',
    params: query
  })
}

/**
 * TODO 新增区域代码项
 * @param params
 */
export function createAreaCodeItem (params) {
  return fetch({
    url: '/',
    method: 'post',
    params: params || {}
  })
}

/**
 * TODO 编辑区域代码项
 * @param params
 */
export function editAreaCodeItem (params) {
  return fetch({
    url: '/'
  })
}

/**
 * TODO 删除区域代码项
 * @param params
 */
export function deleteAreaCodeItem (params) {
  return fetch({
    url: '/'
  })
}
