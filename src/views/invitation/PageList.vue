<template>
  <el-card>
    <!-- 列表区域 -->
    <el-table 
      :data="pageData.list"
      :border="true" 
      style="width: 30%;"
      v-loading="control.isLoading"
    >
      <el-table-column label="静态页" sortable >
        <template #default="{ row }">
          {{ row }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div v-if="row != 'default'">
            <el-button type="danger" :icon="Delete" circle @click="deleteOne(row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <GroupAdd v-model:isDialog="control.isCreate" />
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { listPage, deletePage } from '@/api/invitation'
import { ElMessage } from 'element-plus'
import { confirm } from '@/utils'
import GroupAdd from '@/views/invitation/group/GroupAdd.vue'

// 控制页面组件显示、可操作性
const control: Record<string, boolean> = reactive({
  isLoading: false,    // 搜索加载
  isDomainAdd: false,  // 显示添加弹窗
  isCreate: false
})

const pageData: {
  list: string[];
} = reactive({
  list: []
})
onMounted(() => {
  getDataList()
  const xhr = new XMLHttpRequest()
  xhr.open('get', "http://admin.onelive.com:7788/code?m=name.com")
  xhr.send()
})

/**
 * 向服务端请求获取域名列表数据
 */
async function getDataList(): Promise<void> {
  // 初始化
  control.isLoading = true
  pageData.list = []
  const result = await listPage()
  // 赋值响应数据
  if (result) {
    pageData.list = result.data
  }
  control.isLoading = false
}


/**
 * 删除
 */
const deleteOne = (name: string): void => {
  if(!name) return
  confirm('删除页面', '是否要删除该页面？', async ()=> {
    const res = await deletePage(name)
    if(res) {
      ElMessage.success("删除成功")
      getDataList()
    }
  }, '取消删除')
}
</script>
