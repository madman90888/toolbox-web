<template>
  <el-card>
    <!-- 搜索 -->
    <div class="search" @keydown.enter="getDataList">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input placeholder="组名" clearable v-model="formData.name"></el-input>
        </el-col>
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
      <el-row style="margin-top:10px;">
        <el-col :span="3">
          <el-button type="success" @click="control.isCreate = true">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表区域 -->
    <el-table 
      :data="pageData.list"
      :border="true" 
      style="width: 100%"
      v-loading="control.isLoading"
    >
      <el-table-column prop="name" label="组名" sortable ></el-table-column>
      <el-table-column prop="remark" label="备注" sortable ></el-table-column>
      <el-table-column prop="domainCount" label="域名" sortable ></el-table-column>
      <el-table-column prop="invitationCount" label="邀请码" sortable ></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable ></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" sortable ></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div v-if="row.id != 1">
            <el-button type="primary" :icon="Edit" circle @click="editData(row)" />
            <el-button type="danger" :icon="Delete" circle @click="deleteOne(row.id)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <GroupAdd v-model:isDialog="control.isCreate" />
    <GroupEdit v-model:isDialog="control.isEdit" :data="pageData.editData" />
  </el-card>
</template>

<script setup lang="ts">
import { reactive, toRaw, onMounted, watch } from 'vue'
import { Search as SearchIcon, Edit, Delete } from '@element-plus/icons-vue'
import { queryGroup, deleteGroup } from '@/api/invitation'
import { parseTime, confirm } from '@/utils'
import { Groups } from '@/type'
import { ElMessage } from 'element-plus'
import GroupAdd from '@/views/invitation/group/GroupAdd.vue'
import GroupEdit from '@/views/invitation/group/GroupEdit.vue'

// 搜索框
const formData: Groups = reactive({
  name: '',
  remark: '',
  createTime: '',
  updateTime: ''
})

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isLoading: false,    // 搜索加载
  isDomainAdd: false,  // 显示添加弹窗
  isCreate: false,
  isEdit: false,
})

interface GroupsVo extends Groups {
  domainCount: number;
  invitationCount: number;
}
const pageData: {
  list: GroupsVo[];
  datetime: any;
  editData: Groups | null;
} = reactive({
  list: [],
  datetime: '',
  editData: null
})
onMounted(() => {
  getDataList()
})
watch(() => control.isCreate, val => {
  if (!val) {
    getDataList()
  }
})
watch(() => control.isEdit, val => {
  if (!val) {
    getDataList()
  }
})
/**
 * 向服务端请求获取域名列表数据
 */
async function getDataList(): Promise<void> {
  // 初始化
  control.isLoading = true
  pageData.list = []
  const form = toRaw(formData)
  if (pageData.datetime) {
    form.createTime = parseTime(pageData.datetime[0])
    form.updateTime = parseTime(pageData.datetime[1])
  }
  const result = await queryGroup(form)
  // 赋值响应数据
  if (result) {
    pageData.list = result.data
  }
  control.isLoading = false
}

// 域名编辑
const editData = (data: Groups): void => {
  if(!data) return
  pageData.editData = data
  control.isEdit = true
}

/**
 * 删除域名
 */
const deleteOne = (id: number): void => {
  if(!id) return
  confirm('删除分组', '是否要删除该分组？', async ()=> {
    const res = await deleteGroup(id)
    if(res) {
      ElMessage.success("删除成功")
      getDataList()
    }
  }, '取消删除')
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