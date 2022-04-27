<template>
  <el-result title="404" sub-title="Sorry, request error">
    <template #icon>
      <el-image
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
      />
    </template>
    <template #extra>
      <router-link to="/">
        <el-button type="primary">Back</el-button>
      </router-link>
    </template>
  </el-result>
</template>