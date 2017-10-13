/**
 * Created by skz on 2017/10/12 12:10
 */

// ===================================
// =========== 麻辣教主 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

/**
 * 获取区域代码
 * @param query
 */
export function fetchSpicyLeaderList (query) {
  return request.get({
    url: '/spicyleader/list',
    reqMethod: 'popularize.magazine.operate.getAllMagazine',
    params: {}
  })
}

export function createSpicyLeader (params) {
  return request.post({
    // url: '/spicyleader/create',
    reqMethod: 'popularize.magazine.operate.saveMagazine',
    params: params
  })
}

export function editSpicyLeader (params) {
  return request.post({
    // url: '/spicyleader/edit',
    reqMethod: 'popularize.magazine.operate.updateMagazine',
    params: params
  })
}

export function deleteSpicyLeader (id) {
  return request.post({
    // url: 'spicyleader/delete',
    reqMethod: 'popularize.magazine.operate.deleteMagazine',
    params: {id}
  })
}

export function fetchSpicyLeaderById (id) {
  return request.get({
    // url: 'spicyleader/fetch',
    reqMethod: 'popularize.magazine.operate.selectMagazine',
    params: {id}
  })
}

// ----------- Vote  Service -------------------
// =============================================

export function createVote (params) {
  return request.post({
    // url: 'spicyleader/vote/create',
    reqMethod: 'popularize.magazine.operate.saveMagazineVote',
    params: params
  })
}

export function updateVote (params) {
  return request.post({
    // url: 'spicyleader/vote/update',
    reqMethod: 'popularize.magazine.operate.updateMagazineVote',
    params: params
  })
}

export function fetchVoteById (vid) {
  return request.post({
    // url: 'spicyleader/vote/fetch',
    reqMethod: 'popularize.magazine.operate.selectMagazineVote',
    params: {id: vid}
  })
}

export function fetchVoteByMagazineId (mId) {
  return request.post({
    // url: 'spicyleader/vote/fetchByMid',
    reqMethod: 'popularize.magazine.operate.selectMagazineVoteByMagazineId',
    params: {id: mId}
  })
}

// ----------- Vote Item Service ---------------
// =============================================

export function fetchVoteItemList (voteId) {
  return request.get({
    // url: '/spicyleaderitem/list',
    reqMethod: 'popularize.magazine.operate.getAllMagazineVoteOptions',
    params: {voteId}
  })
}

export function createVoteItem (params) {
  return request.post({
    // url: 'spicyleader/voteitem/create',
    reqMethod: 'popularize.magazine.operate.saveMagazineVoteOptions',
    params: params
  })
}

export function updateVoteItem (params) {
  return request.post({
    // url: 'spicyleader/voteitem/update',
    reqMethod: 'popularize.magazine.operate.updateMagazineVoteOptions',
    params: params
  })
}

export function fetchVoteItemById (id) {
  return request.post({
    // url: 'spicyleader/voteitem/fetchById',
    reqMethod: 'popularize.magazine.operate.selectMagazineVoteOptions',
    params: {id}
  })
}

// ----------- Theme Item Service ---------------
// =============================================

export function fetchSpicyThemeList () {
  return request.post({
    url: '/spicyleader/theme/fetch',
    reqMethod: 'popularize.magazine.operate.getAllTag'
  })
}

export function createSpicyThemeItem (params) {
  return request.post({
    url: '/spicyleader/theme/create',
    reqMethod: 'popularize.magazine.operate.createTag',
    params: params
  })
}

export function updateSpicyThemeItem (params) {
  return request.post({
    url: '/spicyleader/theme/update',
    reqMethod: 'popularize.magazine.operate.updateTag',
    params: params
  })
}

export function deleteSpicyThemeItem (id) {
  return request.post({
    url: '/spicyleader/theme/delete',
    reqMethod: 'popularize.magazine.operate.deleteTag',
    params: {id}
  })
}

export function fetchSpicyThemeItemById (id) {
  return request.post({
    url: '/spicyleader/theme/select',
    reqMethod: 'popularize.magazine.operate.selectTag',
    params: {id}
  })
}

