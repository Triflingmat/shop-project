<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a>个人中心</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 页面容器 -->
  <div class="person-center-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-info-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户信息</span>
        </div>
      </template>
      
      <div class="user-info-content">
        <div class="info-item">
          <span class="info-label">用户ID：</span>
          <span class="info-value">{{ userStore.userInfo?.id }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">用户名：</span>
          <span class="info-value">{{ userStore.userInfo?.username }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">用户权限：</span>
          <span class="info-value">{{ userPowerMap[userStore.userInfo?.power ?? 0] }}</span>
        </div>
      </div>
      
      <!-- 操作按钮区域 -->
      <div class="card-actions">
        <el-button type="primary" @click="Reset" class="action-button reset-button">
          <el-icon><Refresh /></el-icon>
          重置密码
        </el-button>
        <el-button type="danger" @click="Exit" class="action-button exit-button">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="PersonCenter">
// JS
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { putUserData } from '@/api/user'
import { UpdateData } from '@/utils/crud'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Refresh, SwitchButton } from '@element-plus/icons-vue'

const userPowerMap: Record<number, string> = {
  1: "超级管理员",
  2: "管理员"
}

const userStore = useUserStore()

function Exit() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logout()
      router.push('/login')
    })
    .catch(() => {})
}

function Reset() {
  const userData = userStore.userInfo

  if (!userData) return

  ElMessageBox.prompt('请输入新密码', '重置密码', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: userData.password,
    inputType: 'password'
  })
    .then(({ value }) => {
      userData.password = value
      UpdateData(
        putUserData,
        userData,
        () => {},
        ref(false)
      )
      userStore.login(userData)
    })
    .catch(() => {})
}
</script>

<style scoped>
/* CSS */
.person-center-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.breadcrumb {
  margin-bottom: 30px;
  font-size: 14px;
}

.user-info-card {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.user-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-info-content {
  padding: 20px 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item:hover {
  background-color: #fafafa;
  padding-left: 10px;
  border-radius: 4px;
}

.info-label {
  width: 120px;
  font-weight: 500;
  color: #666;
  margin-right: 20px;
}

.info-value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  padding: 20px 0 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;
}

.action-button {
  min-width: 120px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.action-button .el-icon {
  margin-right: 8px;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.reset-button {
  background-color: #409eff;
  border-color: #409eff;
}

.reset-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.exit-button {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.exit-button:hover {
  background-color: #f78989;
  border-color: #f78989;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .person-center-container {
    padding: 10px;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-button {
    width: 100%;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    width: 100%;
    margin-right: 0;
  }
}
</style>