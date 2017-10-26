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
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.getAllMagazine',
    params: {}
  })
}

export function createSpicyLeader (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazine',
    params: params
  })
}

export function editSpicyLeader (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.updateMagazine',
    params: params
  })
}

export function publishSpicyLeader (id, status) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.updateMagazine',
    params: {id, status}
  })
}

export function deleteSpicyLeader (id, status = -1) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazine',
    params: {id, status}
  })
}

export function fetchSpicyLeaderById (id) {
  return request.get({
    reqMethod: 'operation.popularize.magazine.operate.selectMagazine',
    params: {id}
  })
}

// ----------- Vote  Service -------------------
// =============================================

export function createVote (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVote',
    params: params
  })
}

export function updateVote (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVote',
    params: params
  })
}

export function fetchVoteById (vid) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.selectMagazineVote',
    params: {id: vid}
  })
}

export function fetchVotesByMagazineId (magazineId) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.getMagazineVote',
    params: {magazineId: magazineId}
  })
}

export function deleteVote (id, status = -1) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazineVote',
    params: {id, status}
  })
}

export function enableVote (status) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.enableMagazineVote',
    params: {status}
  })
}

// ----------- Vote Item Service ---------------
// =============================================

export function fetchVoteItemList (voteId) {
  return request.get({
    reqMethod: 'operation.popularize.magazine.operate.getAllMagazineVoteOptions',
    params: {voteId}
  })
}

export function createVoteItem (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.saveMagazineVoteOptions',
    params: params
  })
}

export function updateVoteItem (params) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.updateMagazineVoteOptions',
    params: params
  })
}

export function fetchVoteItemById (id) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.selectMagazineVoteOptions',
    params: {id}
  })
}

export function deleteVoteItem (id) {
  return request.post({
    reqMethod: 'operation.popularize.magazine.operate.deleteMagazineVoteOptions',
    params: {id}
  })
}

