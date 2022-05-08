<template>
  <el-card>
    <!-- 搜索 -->
    <el-row :gutter="20" class="search" @keydown.enter="getZones">
      <el-col :span="5">
        <el-input placeholder="域名" clearable v-model="zoneForm.name"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" :icon="SearchIcon" @click="getZones">搜索</el-button>
      </el-col>
      <el-col :span="12" style="color:red;">
        请不要查询大量域名，否则将会导致身份令牌被锁定
      </el-col>
    </el-row>
    <!-- 列表区域 -->
    <el-table
      :data="pageData.zoneList"
      :border="true"
      style="width: 100%"
      v-loading="control.isLoading"
      :default-sort="{ prop: zoneForm.order, order: zoneForm.direction == 'des' ? 'descending' : 'ascending' }"
      @cell-dblclick="getDns"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" 
        label="域名"
        sortable
        ></el-table-column>
      <el-table-column prop="status" label="状态" width="180" sortable>
        <template #default="scope">
          <el-tag :type="statusColor(scope.row.status)">{{ statusList[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="自动HTTPS">
        <template #default="{ row: { auto }  }">
          <el-tag
            v-if="!auto.message"
            size="large" type="info"
          ><loading-icon /></el-tag>
          <el-switch
            v-if="auto.message"
            v-model="auto.success"
            class="mt-2"
            style="margin-left: 24px"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            @change="autoChange(auto)"
          />
        </template>
      </el-table-column>
      <el-table-column label="始终使用HTTPS">
        <template #default="{ row: { always } }">
          <el-tag
            v-if="!always.message"
            size="large" type="info"
          ><loading-icon /></el-tag>
          <el-switch
            v-if="always.message"
            v-model="always.success"
            class="mt-2"
            style="margin-left: 24px"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            @change="alwaysChange(always)"
          />
        </template>
      </el-table-column>
      <el-table-column label="SSL级别">
        <template #default="{ row: { ssl } }">
          <el-tag
            v-if="!ssl.message"
            size="large" type="info"
          ><loading-icon /></el-tag>
          <el-select
            v-if="ssl.message"
            v-model="ssl.message"
            @change="sslChange(ssl)"
            >
            <el-option label="关闭" value="off"></el-option>
            <el-option label="灵活" value="flexible"></el-option>
            <el-option label="完全" value="full"></el-option>
            <el-option label="严格" value="strict"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="created_on" label="创建时间" :formatter="formateDate" sortable></el-table-column>
      <el-table-column prop="modified_on" label="修改时间" :formatter="formateDate" sortable></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="zoneForm.page"
      v-model:page-size="zoneForm.limit"
      :total="pageData.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <el-dialog title="DNS记录" v-model="control.isDNS">
      <dns-list :data="pageData.dnsList" :isLoading="control.isDnsLoad"
        @getDns="getDns" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, toRaw, UnwrapNestedRefs } from 'vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import { queryZone, queryDns, updateAlwaysUseHttps, updateAutoHttps,
      getAutoHttps, getAlwaysUseHttps, getSSL, updateSSL } from '@/api/flare'
import { parseTime } from '@/utils'
import { ZoneSearch, Zone, ZoneRow, Dns, ResultData } from '@/type'
import DnsList from '@/components/DnsList.vue'
import LoadingIcon from '@/components/Loading.vue'
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface ZoneAll extends Zone {
  auto: ZoneRow;
  always: ZoneRow;
  ssl: ZoneRow;
}
// 状态列表 固定值
const statusList: Record<string, string> = {
  active: "活动",
  pending: "挂起",
  initializing: "初始化",
  moved: "移动",
  deleted: "删除",
  deactivated: "停用",
}
// 搜索框
const zoneForm: ZoneSearch = reactive({
  name: '',
  status: '',
  order: '',
  direction: '',
  page: 1,
  limit: 5
})

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isLoading: false,    // 搜索加载
  isDNS: false,
  isDnsLoad: false
})

const pageData: {
  zoneList: ZoneAll[];
  selectList: Zone[];
  total?: number;
  pageCount?: number;
  resData: ZoneRow[];
  dnsList: Dns[];
} = reactive({
  zoneList: [],   // 服务器返回的域名信息列表
  selectList: [], // 选择的域名列表
  total: 0,
  pageCount: 0,
  resData: [],
  dnsList: []
})

/**
 * 向服务端请求获取域名列表数据
 */
async function getZones(): Promise<void> {
  // 初始化
  control.isLoading = true
  pageData.zoneList = []
  // 转为普通对象
  const form = toRaw(zoneForm)
  const result = await queryZone(form)
  // 赋值响应数据
  if (result) {
    const data = result.data
    pageData.zoneList = initRecord(data.record)
    pageData.total = data.total
    pageData.pageCount = data.pages
    control.isLoading = false

    // 初始化HTTPS状态
    pageData.zoneList.forEach(async zone => {
      // 自动HTTPS
      let res = await getAutoHttps(zone.name)
      updateResult(res, zone.auto)
      zone.auto.success = res.data.message == '开启' ? true : false

      // 始终使用HTTPS
      res = await getAlwaysUseHttps(zone.name)
      updateResult(res, zone.always)
      zone.always.success = res.data.message == '开启' ? true : false

      // SSL
      res = await getSSL(zone.name)
      updateResult(res, zone.ssl)
    })
  }
  control.isLoading = false
}

/**
 * 初始化表格数据
 * @param data 表格数据
 */
function initRecord(data: Zone[]): ZoneAll[] {
  if(!data) return []
  const obj = {
    name: '',
    success: true,
    message: ''
  }
  data.forEach(item => {
    (item as ZoneAll).auto = {...obj};
    (item as ZoneAll).always = {...obj};
    (item as ZoneAll).ssl = {...obj};
  })
  return data as ZoneAll[]
}

/**
 * 更新表格行数据
 * @param res 结果对象
 * @param item 表格行数据
 */
function updateResult(res: ResultData, item: UnwrapNestedRefs<ZoneRow>) {
  if (!res) return
  item.message = res.data.message
  item.name = res.data.name
  if (!res.data.success) {
    item.success = false
  }
}

const autoChange = async (item: ZoneRow): Promise<void> => {
  const result = await updateAutoHttps(item.name, item.success)
  if (!result) return
  ElMessage.success(`${item.success ? '启用' : '停用'} 自动跳转HTTPS`)
}

const alwaysChange = async (item: ZoneRow): Promise<void> => {
  const result = await updateAlwaysUseHttps(item.name, item.success)
  if (!result) return
  ElMessage.success( `${item.success ? '启用' : '停用'} 强制跳转HTTPS`)
}

const sslChange = async (item: ZoneRow): Promise<void> => {
  const result = await updateSSL(item.name, item.message)
  if (!result) return
  ElMessage.success("SSL/TLS 模式 修改成功")
}

/**
 * 根据状态选择不同颜色显示
 * @param status 状态
 */
function statusColor(status: string): string {
  if (status == "active") {
    return "success";
  }
  if (status == "deactivated") {
    return "danger";
  }
  return "info";
}

/**
 * 时间格式化
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formateDate(row: any, column: any, cellValue: any, index: any) {
  return parseTime(cellValue);
}
// 根据域名获取DNS记录
async function getDns(row: Zone, column: { label: string }) {
  if(column.label !== '域名') return
  pageData.dnsList = []
  control.isDnsLoad = true
  control.isDNS = true
  const res = await queryDns({ zone_id: row.id } )
  control.isDnsLoad = false
  if (res) {
    pageData.dnsList = res.data
  }
}
</script>

<style scoped>
.search {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>