/**
 * Created by skz on 2017/10/30 14:45
 */
// ===================================
// =========== 商场 ===============
// =========== ------- ===============
// -----------  ---------------
// ===================================

import request from '@/common/ajax'

export function fetchMallsList () {
  return request.post({
    reqMethod: 'operation.base.mall.getAllMallBrief'
  })
}
