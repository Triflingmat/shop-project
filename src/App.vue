<script setup lang="ts">
// App 根组件 —— 直接渲染路由视图（路由自动决定使用 Layout 还是独立页面）
</script>

<template>
    <router-view />
</template>

<style>
/* 全局基础样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    background: #f5f5f5;
}
a {
    text-decoration: none;
    color: inherit;
}
</style>
