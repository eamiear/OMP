/**
 * Created by skz on 2017/10/19 12:28
 */
// ===================================
// =========== 用户管理 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

export function fetchUserInfo (uid) {
  return request.post({
    reqMethod: 'account.operation.user.getUserByUid',
    params: {uid}
  })
}

export function fetchUserList (sysId = 5) {
  return request.post({
    reqMethod: 'account.operation.user.getUserList',
    params: {sysId}
  })
}

export function enableUser (uid) {
  return request.post({
    reqMethod: 'account.operation.user.unDisableUser',
    params: {uid}
  })
}

export function disableUser (uid) {
  return request.post({
    reqMethod: 'account.operation.user.disableUser',
    params: {uid}
  })
}
