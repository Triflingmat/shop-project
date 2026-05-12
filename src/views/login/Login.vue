<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginForm = ref({
    username: '',
    password: '',
})
const loading = ref(false)

const handleLogin = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
        ElMessage.warning('请输入用户名和密码')
        return
    }
    loading.value = true
    try {
        await userStore.login(loginForm.value.username, loginForm.value.password)
        ElMessage.success('登录成功')
        const redirect = (route.query.redirect as string) || '/home'
        router.push(redirect)
    } catch (e: any) {
        ElMessage.error(e.message || '登录失败')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <h2 class="title">用户登录</h2>
            <el-form :model="loginForm" label-width="0" size="large">
                <el-form-item>
                    <el-input v-model="loginForm.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="请输入密码"
                        show-password
                        @keyup.enter="handleLogin"
                    >
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" :loading="loading" @click="handleLogin" style="width: 100%">
                        登 录
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="extra">
                <span>还没有账号？</span>
                <router-link to="/register">立即注册</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}
.login-card {
    width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}
.title {
    text-align: center;
    margin-bottom: 32px;
    color: #333;
    font-size: 24px;
}
.extra {
    text-align: center;
    font-size: 14px;
    color: #999;
}
.extra a {
    color: #e4393c;
    margin-left: 4px;
}
</style>
