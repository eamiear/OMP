/**
 * Created by skz on 2017/10/10 17:48
 */

export const AUTHORITY_KEY = 'account_session_authinfo'

export const USER_TOKEN = ''

export const SESSION_REQUEST = 'account.session.gen'

export const SERVICE_CODE = {
  '99990001': '会话失效',
  '99990002': 'Token非法',
  '99990003': '创建业务异常新实例失败',
  '99990004': '时间戳过期',
  '99990005': '服务返回结果对象为空对象',
  '99990006': '启动一个数据库事务失败',
  '99990007': '参数{0}不能为空',
  '99990008': '参数{0}非法',
  '99990009': '用户不存在',
  '99990010': '安全码验证失败',
  '99990011': '无效APPID',
  '99990012': '未知错误：{0}',
  '99990013': '请求的业务参数解析异常',
  '99990014': '你操作太频繁了，请歇一会儿！',
  '99990015': '',
  '99990016': '系统错误：{0}',
  '99990017': '非法访问',
  '99990018': '签名验证失败',
  '99990019': '系统不舒服,请稍后再试',
  '99990020': '未登录',
  '99990021': '调用的服务不存在',
  '99990022': '服务类型错误'
}

export const INVALID_SESSION = 99990001
export const INVALID_TOKEN = 99990002
export const CREATE_SERVICE_FAIL = 99990003
export const TIMESTAMP_EXPIRE = 99990004
export const RESPONSE_EMPTY_OBJECT = 99990005
export const TRANSITION_FAIL = 99990006
