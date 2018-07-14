import wepy from 'wepy'
import Tips from './Tips'
const app = getApp()

// HTTP工具类
export default class http {
  static async request (method, url, data) {
    const param = {
      url: url,
      method: method,
      data: data
    }
    Tips.loading()
    const res = await wepy.request(param)
    if (res.statusCode === 401 && res.data.message === 'Token has expired') {
      await Tips.error('登录已过期')
      wepy.removeStorageSync('access_token')
      wepy.removeStorageSync('access_token_expired_at')
      wepy.redirectTo({
        url: '../home/index'
      })
    }
    if (this.isSuccess(res)) {
      return res.data
    }
    throw this.requestException(res)
  }

  /**
   * 判断请求是否成功
   */
  static isSuccess(res) {
    const wxCode = res.statusCode
    // 微信请求错误
    return wxCode === 200 || wxCode === 201 || wxCode === 202 || wxCode === 204
  }

  /**
   * 异常处理
   */
  static requestException(res) {
    const error = {}
    error.statusCode = res.statusCode
    const serverData = res.data
    if (serverData) {
      error.serverCode = serverData.status_code
      error.message = serverData.message
      error.serverData = serverData
    }
    return error
  }

  static get (url, data) {
    return this.request('GET', url, data)
  }

  static put (url, data) {
    return this.request('PUT', url, data)
  }

  static post (url, data) {
    return this.request('POST', url, data)
  }

  static patch (url, data) {
    return this.request('PATCH', url, data)
  }

  static delete (url, data) {
    return this.request('DELETE', url, data)
  }
}
