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
    reqMethod: 'spicyleader.list',
    params: {}
  })
}
