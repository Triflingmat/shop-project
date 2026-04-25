<template >
  <el-container style="height: 100vh;background-color: #f5f5f5;">
    <el-header  class="divheader">
      <div style="display: flex;flex-direction: row;align-items: center;">
        <h1 style="margin-left: 10px;">商品后台管理系统</h1>
        <el-button :icon="Fold" @click="isCollapse=!isCollapse" class="btn-Fold" plain />
      </div>
      <h3>欢迎使用商城后台管理系统，{{ userStore.power === 1?"超级管理员":"管理员" }}</h3>
      <div>
        <el-dropdown class="dropdown" @command="handleCommand">
          <span>
            {{ userStore.power === 1?"超级管理员":"管理员" }}<el-icon><ArrowDown/></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="ToPersonCenter">个人中心</el-dropdown-item>
              <el-dropdown-item :command="Exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
  <el-container>
      <el-aside class="divaside" :width="isCollapse?'64px':'300px'">
        <el-menu
          router="true"
          active-text-color="#333333"
          background-color="#ffffff"
          class="el-menu-vertical-demo"
          text-color="#333333"
          :collapse="isCollapse"
          style="height: 100%;border: none;"
          :default-active="defaultActive"
          >
          <el-menu-item index="1" route="home">
            <el-icon><Menu/></el-icon><span>控制台</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title><el-icon><UserFilled /></el-icon><span>用户与权限</span></template>
            <el-menu-item index="2-1" route="adminManage" :disabled="userStore.power === 2"><el-icon><Key/></el-icon><span>管理员管理</span></el-menu-item>
            <el-menu-item index="2-2" route="userManage"><el-icon><User/></el-icon><span>用户管理</span></el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title><el-icon><GoodsFilled /></el-icon><span>商品管理</span></template>
            <el-menu-item index="3-1" route="goodsManage">
              <el-icon><ShoppingTrolley/></el-icon><span>商品属性</span>
            </el-menu-item>
            <el-menu-item index="3-2" route="categoryManage">
              <el-icon><Handbag/></el-icon><span>商品分类</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title><el-icon><List /></el-icon><span>订单管理</span></template>
            <el-menu-item index="4-1" route="orderManage">
              <el-icon><Document/></el-icon><span>订单信息</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title><el-icon><PhoneFilled /></el-icon><span>售后管理</span></template>
            <el-menu-item index="5-1" route="aftersaleManage">
              <el-icon><Service/></el-icon><span>售后问题</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
        <el-main>
          <RouterView v-slot="{ Component }">
            <component :is="Component" :layout-prop="defaultActive"
            @update:default-active="updateDefaultActive"
            />
          </RouterView></el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup name="Layout">
  //JS
  import {RouterView} from 'vue-router'
  import { ArrowDown , UserFilled,GoodsFilled,List,PhoneFilled,User,Key,Handbag,Document,Service,Menu, ShoppingTrolley,Fold} from '@element-plus/icons-vue'
  import router from '@/router/index'
  import { useUserStore } from '@/stores/user'
  import {ref} from 'vue'

  const userStore = useUserStore();
  const isCollapse = ref(false)
  const defaultActive = ref('1')


  function updateDefaultActive(activeItem:string) {
  defaultActive.value = activeItem;
}

  //function
  function ToPersonCenter(){
    defaultActive.value = '0'
    router.push('/personCenter')
  }
  function Exit(){
    userStore.logout()
    router.push('/login')
  }
  function handleCommand(command:Function) {
    command();
  }
</script>
    
<style scoped>
/* CSS */
.divheader{
  flex-direction: row;
  display: flex;
  background: #ffffff;
  color: #333333;
  height: 60px;
  justify-content:space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.divaside{
  height: 100%;
  background-color: #ffffff;
  transition: width 0.5s ease; 
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e0e0e0;
  margin: 0 10px;
}

h3 a{
  flex-direction: row;
  display: flex;
  color: #666666;
  text-decoration: none;
  align-items: center;
  justify-content:space-between;
  padding: 10px ;
}

:deep(.dropdown){
  font-size: 16px;          
  font-weight: 500;
  color: #333333;
  line-height: 1.4;
}

.btn-Fold{
  margin-left: 20px;
  font-size: 25px;
  justify-content: center;
  display: flex;
  background: transparent;
  border: none; 
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-Fold:hover{
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.3);
}

.btn-Fold:active{
  transform: scale(0.9);
  background: rgba(0, 0, 0, 0.1);
}

/* 菜单样式优化 */
:deep(.el-menu-vertical-demo) {
  background-color: #ffffff;
}

:deep(.el-menu-item) {
  transition: all 0.3s ease;
  color: #333333 !important;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  color: #333333 !important;
}
:deep(.el-menu-item.is-active) {
  background-color: #333333 !important;
  color: #ffffff !important;
}

:deep(.el-sub-menu__title) {
  transition: all 0.3s ease;
  color: #333333 !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  color: #333333 !important;
}
:deep(.el-sub-menu__title.is-active) {
  background-color: #333333 !important;
  color: #ffffff !important;
}

/* 折叠按钮动画 */
.btn-Fold {
  transition: all 0.3s ease;
}

/* 头部标题样式 */
h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}

/* 欢迎信息样式 */
h3 {
  font-size: 16px;
  font-weight: 400;
  color: #666666;
}
</style>