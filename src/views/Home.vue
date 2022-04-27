<template>
  <el-container class="container">
    <!-- 头部区域 -->
    <el-header class="header">
      <div>
        <img src="@/assets/logo.png"/>
        <span>域名解析工具</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="../assets/logo.png"/>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="isShow = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="isShow" title="修改密码">
        <update-user @close="isShow = false" />
      </el-dialog>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <Sidebar />
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from '@/views/Sidebar.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
import UpdateUser from '@/views/user/UpdateUser.vue'

const store = useStore()
const isShow = ref(false)

const logout = (): void => {
  store.dispatch('logout')
}
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-content: center;
  background-color: #373d41;
  color: white;
  font-size: 20px;
}
.header div {
  display: flex;
  align-items: center;
}
.header span {
  margin-left: 20px;
}
.header img {
  width: 60px;
  height: 60px;
}
/* 右侧 */
.el-dropdown img {
  border-radius: 50%;
}
/* 侧边栏 */
.el-aside {
  background-color: #333744;
}
/* 内容主体 */
.el-main {
  background-color: #eaedf1;
}
</style>