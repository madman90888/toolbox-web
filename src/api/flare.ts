import request from './ajax'
import { ResultData, ZoneBatch, ZoneSearch,
  Dns } from '@/type'

/**
 * 验证令牌是否有效，若有效服务端会保留
 * @param token Cloudflare令牌
 * @returns 
 */
export const verifyFlareToken = (token: string, expire: string): Promise<ResultData> => {
  const form = new FormData()
  form.append('token', token)
  form.append('expire', expire)
  return request.post('/flare/token', form, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

// 获取令牌
export const getToken = (): Promise<ResultData> => {
  return request.get('/flare/token')
}

// 删除令牌
export const deleteToken = (): Promise<ResultData> => {
  return request.delete('/flare/token')
}

/**
 * 批量添加域名
 * @param data 域名添加对象
 * @returns 
 */
export const createZone = (data: ZoneBatch): Promise<ResultData> => {
  return request.post('/flare/zones', data)
}

/**
 * 批量删除域名
 * @param data 要删除的域名数组
 * @returns 
 */
export const deleteZone = (data: string[]): Promise<ResultData> => {
  return request.delete('/flare/zones', {
    data
  })
}

/**
 * 批量修改域名的HTTPS、ssl级别
 * @param data 要修改的域名
 * @returns 
 */
export const updateZone = (data: ZoneBatch): Promise<ResultData> => {
  return request.patch('flare/zones', data)
}

/**
 * 查询符合条件的域名列表
 * @param params 搜索域名条件
 * @returns 
 */
export const queryZone = (params: ZoneSearch): Promise<ResultData> => {
  return request.get('flare/zones', {
    params
  })
}

/**
 * 下面域名列表
 * @param params 查询条件
 */
export const downloadZone = (params: ZoneSearch): void => {
  request.get('flare/zones/down', {
    params,
    responseType: 'blob'
  })
}

/**
 * 批量添加DNS解析
 * @param data dns记录数组
 * @returns 
 */
export const createDns = (data: Dns[]): Promise<ResultData> => {
  return request.post('/flare/dns', data)
}

/**
 * 批量清空域名下的dns记录
 * @param data 要删除的域名数组
 * @returns 
 */
export const deleteDns = (data: string[]): Promise<ResultData> => {
  return request.delete('/flare/dns', {
    data
  })
}

/**
 * 查询dns记录列表
 * @param params dns查询条件
 * @returns 
 */
export const queryDns = (params: Dns): Promise<ResultData> => {
  return request.get('/flare/dns', {
    params
  })
}
