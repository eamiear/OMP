/**
 * Created by skz on 2017/10/10 14:03
 */

// ===================================
// =========== 系统平台 ===============
// =========== ------- ===============
// ----------- 菜单管理 ---------------
// ===================================

// import fetch from '@/common/fetch'
import request from '@/common/ajax'

/**
 * 获取系统菜单列表
 * @param uid
 */
export function fetchMenuList (uid) {
  return request.post({
    // url: 'system/findMenu',
    reqMethod: 'operation.menu.findMenuTree',
    params: { uid }
  })
}

/**
 * TODO 查询系统菜单
 * @param query
 */
export function searchMenuList (query) {
  // return fetch({
  //   url: '/',
  //   method: 'get',
  //   params: query
  // })
}

/**
 * TODO 新增系统菜单
 * @param params
 */
export function createMenuItem (params) {
  return request.post({
    reqMethod: 'operation.menu.insertMenu',
    params: params
  })
}

/**
 * TODO 编辑系统菜单
 * @param params
 */
export function editMenuItem (params) {
  return request.post({
    reqMethod: 'operation.menu.updateMenu',
    params: params
  })
}

export function showMenuItem (id, isShow) {
  return request.post({
    reqMethod: 'operation.menu.updateMenu',
    params: {id, isShow}
  })
}

/**
 * TODO 删除系统菜单
 * @param id
 */
export function deleteMenuItem (id) {
  return request.post({
    reqMethod: 'operation.menu.deleteMenu',
    params: {id}
  })
}
