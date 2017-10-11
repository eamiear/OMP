/**
 * Created by skz on 2017/10/10 18:13
 */
import { deepSort } from '@/utils/helper'
import { getAuthorityInfo, setAuthorityInfo, removeAuthorityInfo } from '@/utils/auth'
import { SESSION_REQUEST, INVALID_SESSION } from '@/common/constants'
// import fetch from '@/utils/fetch'
import md5 from 'blueimp-md5'

class AJax {
  /*eslint-disable no-useless-call*/
  getSession (callback, params, fncallback) {
    let authInfo = getAuthorityInfo() && JSON.parse(getAuthorityInfo())
    if (!authInfo) {
      this.$http({
        method: 'get',
        params: {method: SESSION_REQUEST}
      }).then((response) => {
        const result = response.data
        if (result && result.code === 0) {
          authInfo = result.data
          authInfo.difference = authInfo.timestamp - Math.floor(Date.now() / 1000)
          setAuthorityInfo(JSON.stringify(authInfo))
          callback.apply(null, params)
        } else {
          fncallback && fncallback.apply(null, [{code: 1, msg: result.msg, data: {}}])
        }
      }).catch((response) => {
        fncallback && fncallback.apply(null, [{code: 1, msg: response.status + ':' + response.statusText, data: {}}])
      })
    } else {
      callback.apply(null, params)
    }
  }
  getSign (method, params) {
    let paramsStr = JSON.stringify(deepSort(params))
    paramsStr = paramsStr.replace(/(\/)/g, '\\$1')
    const authInfo = JSON.parse(getAuthorityInfo())
    const ver = authInfo['ver']
    const timestamp = authInfo['timestamp'] = Math.floor(Date.now() / 1000) + authInfo['difference']
    const sessionKey = authInfo['sessionKey']
    const sessionSecret = authInfo['sessionSecret']
    const mix = 'method=' + method + '&params=' + paramsStr + '&sessionKey=' + sessionKey + '&timesstamp=' + timestamp + '&ver=' + ver + sessionSecret
    return md5(mix)
  }
  getReqParams (method, params) {
    const authInfo = JSON.parse(getAuthorityInfo())
    const sign = this.getSign(method, params)
    return {
      method: method,
      ver: authInfo['ver'],
      timestamp: authInfo['timestamp'],
      sessionKey: authInfo['sessionKey'],
      sign: sign,
      params: params
    }
  }
  get (url, method, params, callback) {
    const _this = this
    const args = [].slice.call(arguments)
    const authInfo = getAuthorityInfo()
    if (!authInfo) {
      this.getSession(this.get, args)
      return
    }
    this.$http({
      url: url,
      method: 'get',
      params: this.getReqParams(method, params)
    }).then((response) => {
      const result = response.data
      if (INVALID_SESSION === result.code) {
        removeAuthorityInfo()
        _this.getSession(this.get, args)
      } else if (callback) {
        callback.call(null, result)
      }
    }).catch((response) => {
      callback && callback.apply(null, [{code: 1, msg: response.status + ':' + response.statusText}])
    })
  }
  post (url, method, params, callback) {
    // TODO
  }
}

export default AJax
