import request from '@/api/ajax'
import { ResultData } from '@/type'

// 获取消息列表
export const getMesList = (mark: string): Promise<ResultData> => {
  return request.get('/msg/' + mark)
}

// 创建会话
export const createMsg = (mark: string, time: number): Promise<ResultData> => {
  return request.post(`/msg/${mark}?time=${time}`)
}

// 添加消息
export const pushMessage = (mark: string, text: string): Promise<ResultData> => {
  return request.put(`/msg/${mark}?text=${text}`)
}

// 删除
export const deleteMessage = (mark: string): Promise<ResultData> => {
  return request.delete(`/msg/${mark}`)
}