import request from './ajax'
import { ResultData, ZoneSearch, Dns } from '@/type'

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
 * 添加域名
 * @param name 域名
 * @param type 域名托管状态
 * @param name 获取现有的 DNS 记录
 * @returns 
 */
export const createZone = (name: string, type: string, jumpStart: boolean): Promise<ResultData> => {
  return request.post('/flare/zones', {
    name, type, jumpStart
  })
}

/**
 * 删除域名
 * @param name 要删除的域名
 * @returns 
 */
export const deleteZone = (name: string): Promise<ResultData> => {
  return request.delete('/flare/zones', {
    data: {
      name
    }
  })
}

/**
 * 自动跳转 HTTPS
 * @param name 域名
 * @param status 状态
 * @returns 
 */
export const updateAutoHttps = (name: string, status: boolean): Promise<ResultData> => {
  const value = status ? 'on' : 'off'
  return request.patch('flare/zones/auto_https', {
    name, value
  })
}

/**
 * 始终使用 HTTPS
 * @param name 域名
 * @param status 状态
 * @returns 
 */
export const updateAlwaysUseHttps = (name: string, status: boolean): Promise<ResultData> => {
  const value = status ? 'on' : 'off'
  return request.patch('flare/zones/always_use_https', {
    name, value
  })
}

/**
 * SSL 级别
 * @param name 域名
 * @param value 级别
 * @returns 
 */
export const updateSSL = (name: string, value: string): Promise<ResultData> => {
  return request.patch('flare/zones/ssl', {
    name, value
  })
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
 * 下载域名列表
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
export const createDns = (data: Dns): Promise<ResultData> => {
  return request.post('/flare/dns', data)
}

/**
 * 批量清空域名下的dns记录
 * @param data 要删除的域名数组
 * @returns 
 */
export const deleteDns = (name: string): Promise<ResultData> => {
  return request.delete('/flare/dns', {
    data: { name }
  })
}


/**
 * 删除指定DNS记录
 * @param zoneId 区域ID
 * @param dnsId id
 * @returns 
 */
export const deleteDnsById = (zoneId: string, dnsId: string): Promise<ResultData> => {
  return request.delete(`/flare/dns/${zoneId}/${dnsId}`)
}

/**
 * 查询dns记录列表
 * @param params dns查询条件
 * @returns 
 */
export const queryDns = (params: any): Promise<ResultData> => {
  return request.get('/flare/dns', {
    params
  })
}
