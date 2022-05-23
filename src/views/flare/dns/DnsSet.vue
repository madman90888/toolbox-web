<template>
  <el-card>
    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane label="添加DNS" name="add">
        <DnsAdd />
      </el-tab-pane>
      <el-tab-pane label="清空DNS" name="del">
        <DnsDel />
      </el-tab-pane>
      <el-tab-pane label="文件添加" name="https">
        <DnsFile />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DnsAdd from '@/views/flare/dns/DnsAdd.vue'
import DnsDel from '@/views/flare/dns/DnsDel.vue'
import DnsFile from '@/views/flare/dns/DnsFile.vue'

const activeName = ref('add')

</script>

<style scope>
.el-tabs__content {
  padding-top: 20px;
}
</style>
<!-- 
<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import type { FormInstance } from 'element-plus'
import BatchRecord from '@/components/BatchRecord.vue'
import { DnsAddForm, DataItem } from '@/type'
import { createDnsList, deleteDnsList } from '@/api/flare'

function deleteDns() {
  dnsRef.value?.validate(async valid => {
    if (!valid) return;
    control.loading = true
    control.dialogVisible = true
    // 整理数据
    let zoneNames: string[] = getNames()
    let res = await deleteDnsList(zoneNames)
    pageData.msg = '清空完毕'
    pageData.batchData = res.data
    control.loading = false
  })
}

</script> -->
