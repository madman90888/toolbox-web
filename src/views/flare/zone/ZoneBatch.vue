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
      <el-tab-pane label="HTTPS列表查询" name="status">
        <p style="color:red">注意：</p>
        <p style="margin: 10px 0;">该功能不能频繁使用，或查询大量域名，否则将会导致API身份令牌被锁定</p>
        <router-link to="/zoneAll">显示域名HTTPS状态</router-link>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ZoneAdd from '@/views/flare/zone/ZoneAdd.vue'
import ZoneDel from '@/views/flare/zone/ZoneDel.vue'
import ZoneHttps from '@/views/flare/zone/ZoneHttps.vue'

const activeName = ref('add')

</script>

<style scope>
.el-tabs__content {
  padding-top: 20px;
}
</style>