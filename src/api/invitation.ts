import request from '@/api/ajax'
import { ResultData, DomainAdd, Groups, DomainUpdate } from '@/type'

// 查询
export const queryDomain = (params: any): Promise<ResultData> => {
  return request.get('/invitation', {
    params
  })
}

// 新增
export const createDomain = (data: DomainAdd): Promise<ResultData> => {
  return request.post('/invitation', data)
}

// 修改
export const updateDomain = (data: DomainUpdate): Promise<ResultData> => {
  return request.patch('/invitation', data)
}

// 删除
export const deleteDomainByIds = (data: number[]): Promise<ResultData> => {
  return request.delete('/invitation', {
    data
  })
}

// 查询分组
export const queryGroup = (params: Groups): Promise<ResultData> => {
  return request.get('/invitation/group', {
    params
  })
}

// 静态页
export const listPage = (): Promise<ResultData> => {
  return request.get('/invitation/page')
}

// 增
export const createGroup = (data: Groups): Promise<ResultData> => {
  return request.post('/invitation/group', data)
}

// 改
export const updateGroup = (data: Groups): Promise<ResultData> => {
  return request.patch('/invitation/group', data)
}

// 删
export const deleteGroup = (id: number): Promise<ResultData> => {
  return request.delete('/invitation/group/' + id)
}

// 删
export const deletePage = (name: string): Promise<ResultData> => {
  return request.delete('/invitation/page/' + name)
}

export const getIndexAccess = (): Promise<ResultData> => {
  return request.get('/indexAccess')
}

export const updateIndexAccess = (data: any): Promise<ResultData> => {
  return request.post('/indexAccess', data)
}