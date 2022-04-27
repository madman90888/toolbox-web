import request from './ajax'
import { ResultData, User } from '@/type'

// 登录
export const reqLogin = (user: User): Promise<ResultData> => {
  return request.post('/login', user, {
    transformRequest: [data => {
      let str = ''
      for(const key in data) {
        str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
      }
      return str
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取用户
export const reqGetUser = (): Promise<ResultData> => {
  return request.get('/currUser')
}

// 退出
export const reqLogout = (): Promise<ResultData> => {
  return request.get('/logout')
}

// 修改密码
export const updatePassword = (oldPass: string, newPass: string): Promise<ResultData> => {
  const data = new FormData()
  data.append('oldPass', oldPass)
  data.append('newPass', newPass)
  return request.post('/user/pass', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
