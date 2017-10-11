/**
 * Created by skz on 2017/10/10 17:48
 */

export const AUTHORITY_KEY = 'account_session_authinfo'

export const INTERFACE_VERSION = '1.0'

export const USER_TOKEN_KEY = 'utopa_token_key'

export const SESSION_REQUEST = 'account.session.gen'

// APP
export const SESSION_EXPIRE = 999500001           // 会话过期
export const SESSION_RENEW = 999500002            // 会话续约
export const INVALID_SESSION = 999500003          // 无效会话
export const INVALID_SIGN = 999500004             // 签名失败

export const NOT_LOGIN_USER = 999500005           // 未登录用户
export const TOKEN_EXPIRE = 999500006             // 令牌过期
export const TOKEN_RENEW = 999500007              // 令牌续约

// request status code
export const REQUEST_SUCCESS = 0                  // 请求成功
export const REQUEST_FAIL = 1                     // 请求失败
