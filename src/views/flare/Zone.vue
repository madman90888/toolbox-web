<template>
  <el-card>
    <!-- 搜索 -->
    <el-row :gutter="20" class="search">
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
      :default-sort="{ prop: zoneForm.order, order: zoneForm.direction == 'des' ? 'descending' : 'descending' }"
      @sort-change="sortHandler"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="域名" sortable="custom"></el-table-column>
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
      <el-button @click="deleteSelectZone" :disabled="control.isClick">删除域名</el-button>
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
      <ZoneAddDel :data="pageData.deleteData"
        :loading="control.isDialogLoading" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, toRaw, watchEffect } from 'vue'
import { Search as SearchIcon, Download } from '@element-plus/icons-vue'
import { queryZone, deleteZone, downloadZone } from '@/api/flare'
import { parseTime } from '@/utils'
import { ZoneSearch, Zone, IZoneAddDel } from '@/type'
import { ElMessageBox, ElMessage } from 'element-plus'
import ZoneAddDel from '@/components/ZoneAddDel.vue'

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
  order: 'created_on',
  direction: 'desc',
  page: 1,
  limit: 10
})

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isClick: true,         // 多选按钮是否可以点击删除
  isDialog: false,   // 是否显示批量结果
  isLoading: false,    // 搜索加载
  isDialogLoading: false
})

const pageData: {
  zoneList: Zone[];
  selectList: Zone[];
  total?: number;
  pageCount?: number;
  deleteData: IZoneAddDel[];
} = reactive({
  zoneList: [],   // 服务器返回的域名信息列表
  selectList: [], // 选择的域名列表
  total: 0,
  pageCount: 0,
  deleteData: []
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
  
  if (result) {
    const data = result.data
    pageData.zoneList = data.record
    pageData.total = data.total
    pageData.pageCount = data.pages
  }
  control.isLoading = false
}

// 排序
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sortHandler({column, prop, order}: any) {
  zoneForm.order = prop
  zoneForm.direction = order=='ascending' ? 'asc' : 'desc'
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
    .then(async () => {
      // 遍历过滤要删除域名的数组
      let list: string[] = pageData.selectList.map(val => val.name) as string[]
      if (list.length == 0) {
        return;
      }
      
      // 显示dialog，展示数据
      control.isDialog = true
      control.isDialogLoading = true
      // 请求接口
      let res = await deleteZone(list)
      pageData.deleteData = res.data
      ElMessage.success("删除成功!")
      control.isDialogLoading = false
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
  const result = await downloadZone(form)
  control.isLoading = false
  if (result) {
    ElMessage.error('下载失败')
  }else{
     ElMessage.success('下载成功')
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