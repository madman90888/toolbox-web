<template>
  <el-card>
    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane label="添加域名" name="add">
        <ZoneAdd />
      </el-tab-pane>
      <el-tab-pane label="删除域名" name="del">
        <ZoneDel />
      </el-tab-pane>
      <el-tab-pane label="HTTPS设置" name="https">
        <ZoneHttps />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ZoneAdd from '@/views/flare/ZoneAdd.vue'
import ZoneDel from '@/views/flare/ZoneDel.vue'
import ZoneHttps from '@/views/flare/ZoneHttps.vue'

const activeName = ref('add')

</script>

<style scope>
.el-tabs__content {
  padding-top: 20px;
}
</style>