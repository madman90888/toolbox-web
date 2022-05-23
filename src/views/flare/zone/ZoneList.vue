<template>
  <el-card>
    <!-- 搜索 -->
    <el-row :gutter="20" class="search" @keydown.enter="getZones">
      <el-col :span="5">
        <el-input placeholder="域名" clearable v-model="zoneForm.name"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select v-model="zoneForm.status" clearable placeholder="请选择" >
          <el-option v-for="k in statusList" :key="k" :label="statusList[k]" :value="k"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" :icon="SearchIcon" @click="getZones">搜索</el-button>
      </el-col>
        <el-col :span="2" :offset="11">
          <el-button type="primary" round :icon="Download" @click="download"> 下载</el-button>
        </el-col>
    </el-row>
    <!-- 列表区域 -->
    <el-table
      :data="pageData.zoneList"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="control.isLoading"
      :default-sort="{ prop: zoneForm.order, order: zoneForm.direction == 'desc' ? 'descending' : 'ascending' }"
      @sort-change="sortHandler"
      @cell-dblclick="getDns"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" 
        label="域名"
        sortable="custom"
        >
        <template #default="{ row }">
          <div  @click.ctrl="clickZone(row)">{{ row.name }}</div>
        </template>
        </el-table-column>
      <el-table-column prop="status" label="状态" width="180" sortable="custom">
        <template #default="scope">
          <el-tag :type="statusColor(scope.row.status)">{{ statusList[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="original_registrar" label="注册商" sortable="custom"></el-table-column>
      <el-table-column prop="created_on" label="创建时间" :formatter="formateDate" sortable="custom"></el-table-column>
      <el-table-column prop="modified_on" label="修改时间" :formatter="formateDate" sortable="custom"></el-table-column>
    </el-table>
    <!-- 批量删除 -->
    <div style="margin-top: 20px">
      <el-button @click="deleteSelectZone" :disabled="control.isClick">删除{{ pageData.selectList.length == 0 ? '' : ` ${pageData.selectList.length}条 `}}域名</el-button>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="zoneForm.page"
      v-model:page-size="zoneForm.limit"
      :total="pageData.total"
      :page-sizes="[20, 50, 200, 500, 1000]"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 显示批量操作记录 -->
    <el-dialog title="批量删除" v-model="control.isDialog">
      <zone-result :data="pageData.resData" />
    </el-dialog>
    <el-dialog title="DNS记录" v-model="control.isDNS">
      <dns-list :data="pageData.dnsList" :isLoading="control.isDnsLoad"
        @getDns="getDns" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, toRaw, watchEffect } from 'vue'
import { Search as SearchIcon, Download } from '@element-plus/icons-vue'
import { queryZone, deleteZone, downloadZone, queryDns } from '@/api/flare'
import { parseTime } from '@/utils'
import { ZoneSearch, Zone, ZoneRow, Dns } from '@/type'
import { ElMessageBox, ElMessage } from 'element-plus'
import ZoneResult from '@/components/ZoneResult.vue'
import DnsList from '@/components/DnsList.vue'

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
  limit: 10
})

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isClick: true,         // 多选按钮是否可以点击删除
  isDialog: false,   // 是否显示批量结果
  isLoading: false,    // 搜索加载
  isDNS: false,
  isDnsLoad: false
})

const pageData: {
  zoneList: Zone[];
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
// 监听数据变化
watchEffect(()=>{
  zoneForm.page + zoneForm.limit
  getZones()
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
  // 将状态转为正确格式
  for (const key in statusList) {
    if (statusList[key] == form.status) {
      form.status = key
      break
    }
  }
  const result = await queryZone(form)
  // 赋值响应数据
  if (result) {
    const data = result.data
    pageData.zoneList = data.record
    pageData.total = data.total
    pageData.pageCount = data.pages
  }
  control.isLoading = false
}

// 点击域名在新窗口打开
const clickZone = (zone: Zone) => {
  window.open('http://' + zone.name)
}

// 排序
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sortHandler({column, prop, order}: any) {
  zoneForm.order = prop
  zoneForm.direction = order == 'ascending' ? 'asc' : 'desc'
  getZones()
}

/**
 * 多选操作，若都没有选择，按钮不可点击
 * @param val 
 */
function handleSelectionChange(val: Zone[]) {
  pageData.selectList = val
  control.isClick = pageData.selectList.length ? false : true
}

/**
 * 删除选择的域名
 */
function deleteSelectZone() {
  ElMessageBox.confirm("此操作将永久删除该域名, 是否继续?", "批量删除域名提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 重置删除列表
      pageData.resData = []
      if (pageData.selectList.length == 0) {
        ElMessage.error('未选择域名，删除失败')
        return;
      }
      // 获取域名数组，遍历发送请求
      control.isDialog = true
      pageData.selectList.forEach(async val => {
        const item = reactive({
                name: val.name,
                success: true,
                message: ''
              })
        pageData.resData.push(item)
        // 发送请求，显示结果
        let res = await deleteZone(item.name)
        if (!res) return
        item.message = res.data.message
        if (!res.data.success) {
          item.success = false
        }
      })
      ElMessage.info(`删除 ${pageData.resData.length} 条域名`)
      // 重新加载数据
      getZones()
    })
    .catch(() => {
      ElMessage.info("已取消删除")
    })
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

async function download() {
  // 初始化
  control.isLoading = true
  // 转为普通对象
  const form = toRaw(zoneForm)
  // 将状态转为正确格式
  for (const key in statusList) {
    if (statusList[key] == form.status) {
      form.status = key
      break
    }
  }
  await downloadZone(form)
  control.isLoading = false
  ElMessage.success('下载成功')
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