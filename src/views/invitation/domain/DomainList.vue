<template>
  <el-card>
    <!-- 搜索 -->
    <div class="search" @keydown.enter="getDataList">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input placeholder="域名" clearable v-model="formData.name"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="邀请码" clearable v-model="formData.code"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="小组" clearable v-model="formData.groupName"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="静态页" clearable v-model="formData.pageName"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin:10px 0;">
        <el-col :span="4">
          <el-input placeholder="备注" clearable v-model="formData.remark"></el-input>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="pageData.datetime"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            size="small"
          />
          <el-button style="margin-left:10px;" type="primary" :icon="SearchIcon" @click="getDataList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <el-button type="success" @click="control.isDomainAdd = true">批量新增</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表区域 -->
    <el-table 
      :data="pageData.domainList"
      :border="true" 
      style="width: 100%" 
      @selection-change="handleSelectionChange"
      v-loading="control.isLoading"
      :default-sort="{ prop: formData.sort, order: formData.direction == 'desc' ? 'descending' : 'ascending' }"
      @sort-change="sortHandler"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="域名" sortable="custom">
        <template #default="{ row }">
          <div @click.ctrl="clickZone(row)">{{ row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="邀请码" sortable="custom"></el-table-column>
      <el-table-column prop="groupName" label="小组" sortable="custom"></el-table-column>
      <el-table-column prop="pageName" label="静态页" sortable="custom"></el-table-column>
      <el-table-column prop="remark" label="备注" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" sortable="custom"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" :icon="Edit" circle @click="domainEdit(row)" />
          <el-button type="danger" :icon="Delete" circle @click="deleteOne(row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 批量删除 -->
    <div style="margin-top: 20px">
      <el-button 
        @click="deleteSelect" 
        :disabled="pageData.checklist.length == 0"
      >删除{{ pageData.checklist.length == 0 ? '' : ` ${pageData.checklist.length}条 `
      }}域名</el-button>
    </div>
    <!-- 分页 -->
    <el-pagination v-model:currentPage="formData.current" v-model:page-size="formData.limit" :total="pageData.total"
      :page-sizes="[20, 50, 200, 500, 1000]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <domain-add v-model:isDialog="control.isDomainAdd" />
    <DomainEdit v-model:isDialog="control.isEdit" :data="pageData.editData" />
  </el-card>
</template>

<script setup lang="ts">
import { reactive, toRaw, watchEffect } from 'vue'
import { Search as SearchIcon, Edit, Delete } from '@element-plus/icons-vue'
import { queryDomain, deleteDomainByIds } from '@/api/invitation'
import { parseTime, confirm } from '@/utils'
import { DomainForm, Domain } from '@/type'
import { ElMessage } from 'element-plus'
import DomainAdd from '@/views/invitation/domain/DomainAdd.vue'
import DomainEdit from '@/views/invitation/domain/DomainEdit.vue'

// 搜索框
const formData: DomainForm = reactive({
  name: '',
  code: '',
  groupName: '',
  pageName: '',
  remark: '',
  createTime: '',
  updateTime: '',
  current: 1,
  limit: 10,
  sort: 'createTime',
  direction: 'desc'
})

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isLoading: false,    // 搜索加载
  isDomainAdd: false,  // 显示添加弹窗
  isEdit: false
})

const pageData: {
  domainList: Domain[];
  checklist: Domain[];
  total?: number;
  pageCount?: number;
  datetime: any;
  editData: Domain | null;
} = reactive({
  domainList: [],
  checklist: [],
  total: 0,
  pageCount: 0,
  datetime: '',
  editData: null
})
// 监听数据变化
watchEffect(() => {
  formData.current + formData.limit
  getDataList()
})
watchEffect(() => {
  if(control.isDomainAdd) return
  getDataList()
})

/**
 * 向服务端请求获取域名列表数据
 */
async function getDataList(): Promise<void> {
  // 初始化
  control.isLoading = true
  pageData.domainList = []
  const form = toRaw(formData)
  if (pageData.datetime) {
    form.createTime = parseTime(pageData.datetime[0])
    form.updateTime = parseTime(pageData.datetime[1])
  }else {
    form.createTime = ''
    form.updateTime = ''
  }
  const result = await queryDomain(form)
  // 赋值响应数据
  if (result) {
    const data = result.data
    pageData.domainList = data.records
    pageData.total = data.total
    pageData.pageCount = data.pages
  }
  control.isLoading = false
}

// 点击域名在新窗口打开
const clickZone = (domain: Domain) => {
  window.open('http://' + domain.name)
}

// 排序
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sortHandler({ column, prop, order }: any) {
  formData.sort = prop
  formData.direction = order == 'ascending' ? 'asc' : 'desc'
  getDataList()
}

/**
 * 多选操作，若都没有选择，按钮不可点击
 * @param val 
 */
function handleSelectionChange(val: Domain[]) {
  pageData.checklist = val
}

// 域名编辑
const domainEdit = (domain: Domain): void => {
  if(!domain) return
  pageData.editData = domain
  control.isEdit = true
}

/**
 * 删除域名
 */
const deleteOne = (id: number): void => {
  if(!id) return
  confirm('删除域名', '是否要删除该域名？', async ()=> {
    const res = await deleteDomainByIds([id])
    if(res) {
      ElMessage.success("删除成功")
      getDataList()
    }
  }, '取消删除')
}
const deleteSelect = (): void => {
  if (pageData.checklist.length == 0) {
    ElMessage.error('未选择域名，删除失败')
    return;
  }
  confirm('删除域名', `是否要删除选中 ${pageData.checklist.length}条域名？`, 
  async ()=> {
    const res = await deleteDomainByIds(pageData.checklist.map(item => item.id))
    if(res) {
      pageData.checklist = []
      ElMessage.success("批量删除成功")
      getDataList()
    }
  }, '已取消删除')
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