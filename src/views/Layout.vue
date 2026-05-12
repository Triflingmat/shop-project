<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, Search, ShoppingCart, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/category'
import { ElMessage } from 'element-plus'

const searchKey = ref('')
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const categoryStore = useCategoryStore()

onMounted(() => {
    // 始终获取分类（公开接口，无需登录）
    categoryStore.fetchCategories().catch(() => {})
})

// 登录后加载购物车
watch(() => userStore.isLoggedIn, (loggedIn) => {
    if (loggedIn) {
        cartStore.fetchCart()
    }
}, { immediate: true })

const doSearch = () => {
    const kw = searchKey.value.trim()
    if (kw) {
        router.push({ name: 'GoodsList', query: { keyword: kw } })
    }
}

const handleLogout = () => {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/home')
}
</script>

<template>
    <div class="layout">
        <!-- 顶部导航栏 -->
        <header class="navbar">
            <div class="navbar-inner">
                <router-link to="/home" class="logo">🛒 优选商城</router-link>
                <nav class="nav-links">
                    <router-link to="/home">首页</router-link>
                    <el-dropdown trigger="hover" class="category-dropdown">
                        <span class="el-dropdown-link">
                            商品分类<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    v-for="cat in categoryStore.categories"
                                    :key="cat.id"
                                    @click="$router.push({ name: 'GoodsList', query: { category: cat.name } })"
                                >
                                    {{ cat.name }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                    v-if="categoryStore.categories.length === 0"
                                    disabled
                                >
                                    暂无分类
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-input
                        v-model="searchKey"
                        placeholder="搜索商品..."
                        class="search-input"
                        size="small"
                        @keyup.enter="doSearch"
                    >
                        <template #append>
                            <el-button @click="doSearch">
                                <el-icon><Search /></el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </nav>
                <div class="nav-actions">
                    <router-link to="/cart" class="cart-link">
                        <el-badge :value="cartStore.cartCount" :hidden="cartStore.cartCount === 0">
                            <el-icon :size="22"><ShoppingCart /></el-icon>
                        </el-badge>
                        <span>购物车</span>
                    </router-link>
                    <template v-if="userStore.isLoggedIn">
                        <el-dropdown trigger="hover">
                            <span class="user-link">
                                <el-icon :size="20"><User /></el-icon>
                                <span>{{ userStore.username }}</span>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="$router.push('/user/profile')">
                                        个人中心
                                    </el-dropdown-item>
                                    <el-dropdown-item divided @click="handleLogout">
                                        退出登录
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                    <template v-else>
                        <router-link to="/login" class="login-link">登录</router-link>
                        <router-link to="/register" class="register-link">注册</router-link>
                    </template>
                </div>
            </div>
        </header>

        <!-- 主体内容 -->
        <main class="main-content">
            <router-view />
        </main>

        <!-- 页脚 -->
        <footer class="footer">
            <div class="footer-inner">
                <div class="footer-col">
                    <h4>购物指南</h4>
                    <p>购物流程</p>
                    <p>支付方式</p>
                    <p>配送说明</p>
                </div>
                <div class="footer-col">
                    <h4>售后服务</h4>
                    <p>退换货政策</p>
                    <p>退款说明</p>
                    <p>联系客服</p>
                </div>
                <div class="footer-col">
                    <h4>关于我们</h4>
                    <p>公司介绍</p>
                    <p>联系方式</p>
                    <p>加入我们</p>
                </div>
                <div class="footer-col">
                    <h4>客服热线</h4>
                    <p class="service-phone">400-888-8888</p>
                    <p>工作时间：9:00 - 18:00</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2026 优选商城 版权所有</p>
            </div>
        </footer>
    </div>
</template>


<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
}

/* === 导航栏 === */
.navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.navbar-inner {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 40px;
    height: 64px;
    gap: 36px;
}
.logo {
    font-size: 22px;
    font-weight: 700;
    color: #e4393c;
    text-decoration: none;
    white-space: nowrap;
}
.nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    flex: 1;
}
.nav-links > a {
    color: #333;
    text-decoration: none;
    font-size: 16px;
    white-space: nowrap;
}
.nav-links > a:hover {
    color: #e4393c;
}
.category-dropdown {
    cursor: pointer;
    color: #333;
    font-size: 15px;
}
.category-dropdown:hover {
    color: #e4393c;
}
/* 下拉菜单项悬停色 */
:deep(.el-dropdown-menu__item:hover) {
    color: #e4393c !important;
    background-color: #fff0f0 !important;
}
.search-input {
    width: 360px;
}
.nav-actions {
    display: flex;
    align-items: center;
    gap: 28px;
    white-space: nowrap;
}
.cart-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #333;
    text-decoration: none;
    font-size: 14px;
}
.cart-link:hover {
    color: #e4393c;
}
.user-link {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: #333;
    font-size: 14px;
}
.login-link,
.register-link {
    color: #333;
    text-decoration: none;
    font-size: 14px;
}
.login-link:hover,
.register-link:hover {
    color: #e4393c;
}

/* === 主体内容 === */
.main-content {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

/* === 页脚 === */
.footer {
    background: #2c2c2c;
    color: #bbb;
    margin-top: 40px;
}
.footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 40px 20px;
    gap: 40px;
}
.footer-col h4 {
    color: #fff;
    margin-bottom: 12px;
    font-size: 16px;
}
.footer-col p {
    margin: 6px 0;
    font-size: 13px;
    cursor: pointer;
}
.footer-col p:hover {
    color: #e4393c;
}
.service-phone {
    font-size: 20px !important;
    font-weight: 700;
    color: #e4393c !important;
}
.footer-bottom {
    border-top: 1px solid #444;
    text-align: center;
    padding: 16px;
    font-size: 12px;
}
</style>
