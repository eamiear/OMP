/**
 * Created by skz on 2017/10/10 14:03
 */

// ===================================
// =========== 系统平台 ===============
// =========== ------- ===============
// ----------- 菜单管理 ---------------
// ===================================

import fetch from '@/utils/fetch'

/**
 * 获取区域代码
 * @param query
 */
export function fetchMenuList (query) {
  return fetch({
    url: '',
    method: 'get',
    params: {method: 'account.session.gen'}
  })
}

/**
 * TODO 查询区域代码
 * @param query
 */
export function searchMenuList (query) {
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
export function createMenuItem (params) {
  return fetch({
    url: '/system/menu',
    method: 'post',
    params: params || {}
  })
}

/**
 * TODO 编辑区域代码项
 * @param params
 */
export function editMenuItem (params) {
  return fetch({
    url: '/system/menu',
    method: 'put',
    params: params
  })
}

/**
 * TODO 删除区域代码项
 * @param id
 */
export function deleteMenuItem (id) {
  return fetch({
    url: '/system/menu',
    method: 'delete',
    params: {id: id}
  })
}
