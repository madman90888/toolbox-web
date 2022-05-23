<template>
  <el-dialog v-model="control.isVisible" title="编辑域名" :before-close="closeDialog" :width="600">
    <el-form :model="pageData.domain" 
      label-width="120px" style="width:400px;">
      <el-form-item label="域名">
        <el-input v-model="pageData.domain.name" />
      </el-form-item>
      <el-form-item label="邀请码">
        <el-input v-model="pageData.domain.code" />
      </el-form-item>
      <el-form-item label="小组">
        <el-select v-model="pageData.domain.groupId" class="m-2" placeholder="请选择小组">
          <el-option
            v-for="item in pageData.groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="静态页">
        <el-select v-model="pageData.domain.pageName" class="m-2" placeholder="请选择静态页">
          <el-option
            v-for="item in pageData.pages"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="pageData.domain.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
    
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, reactive, toRaw } from 'vue'
import { DomainUpdate, Domain, Groups } from '@/type';
import { queryGroup, listPage, updateDomain } from '@/api/invitation'
import { ElMessage } from 'element-plus'

// 父组件传递
const props = defineProps<{
  isDialog: boolean;
  data: Domain | null;
}>()
const control: Record<string, boolean> = reactive({
  isVisible: false
})
const emit = defineEmits(['update:isDialog'])
watch(() => props.isDialog, val => {
  if(control.isVisible != val) control.isVisible = val
  if (val && props.data) {
    pageData.domain = props.data
    getGroup()
    getListPage()
  }
})
watch(() => control.isVisible, val => {
  if (props.isDialog != val) emit('update:isDialog', val)
})
const closeDialog = (done: () => void): void => {
  emit('update:isDialog', false)
  done()
}

const pageData: {
  domain: DomainUpdate;
  groupList: Groups[];
  pages: string[];
} = reactive({
  domain: {
    id: -1,
    name: '',
    code: '',
    remark: '',
    groupId: 1,
    pageName: ''
  },
  groupList: [],
  pages: []
})

const getGroup = async () => {
  const res = await queryGroup({}) 
  if(!res) return
  pageData.groupList = res.data
}

const getListPage = async () => {
  const res = await listPage()
  if(!res) return
  pageData.pages = res.data
}

const save = async () => {
  const res = await updateDomain(toRaw(pageData.domain))
  if(!res) return
  ElMessage.success('修改成功')
  control.isVisible = false
}
</script>
