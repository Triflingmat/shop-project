<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, MapLocation } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
})

const loading = ref(false)

const handleRegister = async () => {
    if (!registerForm.username) return ElMessage.warning('请输入用户名')
    if (registerForm.password.length < 6) return ElMessage.warning('密码至少6位')
    if (registerForm.password !== registerForm.confirmPassword) return ElMessage.warning('两次密码不一致')
    if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) return ElMessage.warning('请输入正确的手机号')

    loading.value = true
    try {
        const registerUser =  await userStore.register({
            username: registerForm.username,
            password: registerForm.password,
            phone: registerForm.phone,
            address: registerForm.address,
        })
        ElMessage.success('注册成功')
        await userStore.login(registerUser.username, registerUser.password)
        const redirect = (route.query.redirect as string) || '/home'
        router.push(redirect)
    } catch (e: any) {
        ElMessage.error(e.message || '注册失败')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="register-page">
        <div class="register-card">
            <h2 class="title">用户注册</h2>
            <el-form :model="registerForm" label-width="0" size="large">
                <el-form-item>
                    <el-input v-model="registerForm.username" placeholder="用户名">
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="registerForm.password" type="password" placeholder="密码（6-20位）" show-password>
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" show-password>
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="registerForm.phone" placeholder="手机号">
                        <template #prefix>
                            <el-icon><Phone /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="registerForm.address" placeholder="收货地址（选填）">
                        <template #prefix>
                            <el-icon><MapLocation /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" :loading="loading" @click="handleRegister" style="width: 100%">
                        注 册
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="extra">
                <span>已有账号？</span>
                <router-link to="/login">立即登录</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}
.register-card {
    width: 420px;
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
