/**
 * Created by skz on 2017/10/16 10:49
 */

// ===================================
// =========== 主题管理 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

export function fetchThemeList () {
  return request.post({
    // url: '/spicyleader/theme/fetch',
    reqMethod: 'popularize.magazine.operate.getAllTag'
  })
}

export function createThemeItem (params) {
  return request.post({
    // url: '/spicyleader/theme/create',
    reqMethod: 'popularize.magazine.operate.saveMagazineTag',
    params: params
  })
}

export function updateThemeItem (params) {
  return request.post({
    // url: '/spicyleader/theme/update',
    reqMethod: 'popularize.magazine.operate.updateMagazineTag',
    params: params
  })
}

export function deleteThemeItem (id) {
  return request.post({
    // url: '/spicyleader/theme/delete',
    reqMethod: 'popularize.magazine.operate.deleteMagazineTag',
    params: {id}
  })
}

export function fetchThemeItemById (id) {
  return request.post({
    // url: '/spicyleader/theme/select',
    reqMethod: 'popularize.magazine.operate.selectTag',
    params: {id}
  })
}

export function searchThemeByName (name) {
  return request.post({
    reqMethod: 'popularize.magazine.operate.getMagazineTag',
    params: {name}
  })
}

export function searchThemeById (id) {
  return request.post({
    reqMethod: 'popularize.magazine.operate.getMagazineTag',
    params: {id}
  })
}
