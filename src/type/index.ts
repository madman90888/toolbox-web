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

// 域名查询
export interface ZoneSearch {
  name: string;
  status: 'active' | 'pending' | 'initializing' | 'moved' | 'deleted' | 'deactivated' | string;
  order: 'id' | 'name' | 'status' | 'paused' | 'type' | 'created_on' | '';
  direction: 'desc' | 'asc' | '';
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

// 域名操作，返回结果
export interface ZoneRow {
  name: string;
  success: boolean;
  message: string;
}

// DNS 信息
export interface Dns {
  id?: string;
  type: string;
  name: string;
  content: string;
  proxiable?: boolean;
  proxied?: boolean;
  ttl?: number;
  zone_id?: string;
  zone_name?: string;
  created_on?: string;
  modified_on?: string;
}

// DNS 操作记录返回
export interface DnsVo extends Dns {
  success: boolean;
  message: string;
}

// 域名搜索表单
export interface DomainForm {
  name: string;
  code: string;
  groupName: string;
  pageName: string;
  remark: string;
  createTime: string;
  updateTime: string;
  current: number;
  limit: number;
  sort: string;
  direction: 'asc' | 'desc';
}

// 域名
export interface Domain {
  id: number;
  name: string;
  code: string;
  remark: string;
  createTime: string;
  updateTime: string;
  groupId: number;
  groupName: string;
  pageName: string;
}

// 添加
export interface DomainAdd {
  name: string;
  code: string;
  groupName: string;
  pageName: string;
  remark: string;
}

export interface DomainUpdate {
  id: number;
  name: string;
  code: string;
  remark: string;
  groupId: number;
  pageName: string;
}
export interface Groups {
  id?: number;
  name?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
  domainCount?: number;
  invitationCount?: number;
}