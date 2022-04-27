// 前后端通信格式
export interface ResultData {
  code: number;
  message: string;
  data?: any;
}

// 用户信息
export interface User {
  username: string;
  password: string;
}

// 域名添加 修改HTTP格式
export interface ZoneBatch {
  zoneNames: string[];
  jump?: boolean;
  type?: 'full' | 'partial';
  auto?: boolean;
  always?: boolean;
  ssl?: 'off' | 'flexible' | 'full' | 'strict' | '';
}

// 域名查询
export interface ZoneSearch {
  name: string;
  status: 'active' | 'pending' | 'initializing' | 'moved' | 'deleted' | 'deactivated' | string;
  order: 'id' | 'name' | 'status' | 'paused' | 'type' | 'created_on';
  direction: 'desc' | 'asc';
  page: number;
  limit: number;
}

// 域名信息
export interface Zone {
  id: string;
  name: string;
  status: string;
  paused: boolean;
  type: string;
  original_registrar: string;
  created_on: string;
  modified_on: string;
  activated_on: string;
  jumpStart: boolean;
}

// DNS 信息
export interface Dns {
  id?: string;
  type: string;
  name: string;
  content: string;
  proxiable?: boolean;
  proxied: boolean;
  ttl?: number;
  zone_id?: string;
  zone_name?: string;
  created_on?: string;
  modified_on?: string;
}

// 域名删除结果
export interface IZoneAddDel {
  success: boolean;
  name: string;
  message: string;
}

// HTTPS设置
export interface HttpsAndSsl {
  zoneName: string;
  auto: {
    success: boolean;
    message: string;
  };
  always: {
    success: boolean;
    message: string;
  };
  ssl: {
    success: boolean;
    message: string;
  };
}

export interface DnsVo extends Dns {
  success: boolean;
  message: string;
}