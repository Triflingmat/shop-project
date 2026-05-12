import { createRouter, createWebHistory } from 'vue-router'
import { isTokenExpired } from '@/utils/token'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Layout.vue'),
            redirect: '/home',
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import('@/views/home/index.vue'),
                    meta: { title: '商城首页' },
                },
                {
                    path: 'goods/list',
                    name: 'GoodsList',
                    component: () => import('@/views/goods/GoodsList.vue'),
                    meta: { title: '商品列表' },
                },
                {
                    path: 'goods/detail/:id',
                    name: 'GoodsDetail',
                    component: () => import('@/views/goods/GoodsDetail.vue'),
                    meta: { title: '商品详情', requiresAuth: true },
                },
                {
                    path: 'cart',
                    name: 'Cart',
                    component: () => import('@/views/cart/CartPage.vue'),
                    meta: { title: '购物车', requiresAuth: true },
                },
                {
                    path: 'order/confirm',
                    name: 'OrderConfirm',
                    component: () => import('@/views/order/OrderConfirm.vue'),
                    meta: { title: '确认订单', requiresAuth: true },
                },
                {
                    path: 'order/list',
                    name: 'OrderList',
                    component: () => import('@/views/order/OrderList.vue'),
                    meta: { title: '我的订单', requiresAuth: true },
                },
                {
                    path: 'order/detail/:id',
                    name: 'OrderDetail',
                    component: () => import('@/views/order/OrderDetail.vue'),
                    meta: { title: '订单详情', requiresAuth: true },
                },
                {
                    path: 'user/profile',
                    name: 'UserProfile',
                    component: () => import('@/views/user/UserProfile.vue'),
                    meta: { title: '个人中心', requiresAuth: true },
                },
                {
                    path: 'aftersale/apply/:orderId',
                    name: 'AftersaleApply',
                    component: () => import('@/views/aftersale/AftersaleApply.vue'),
                    meta: { title: '申请售后', requiresAuth: true },
                },
                {
                    path: 'aftersale/list',
                    name: 'AftersaleList',
                    component: () => import('@/views/aftersale/AftersaleList.vue'),
                    meta: { title: '售后记录', requiresAuth: true },
                },
                {
                    path: 'aftersale/detail/:id',
                    name: 'AftersaleDetail',
                    component: () => import('@/views/aftersale/AftersaleDetail.vue'),
                    meta: { title: '售后详情', requiresAuth: true },
                },
            ],
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/login/Login.vue'),
            meta: { title: '登录' },
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('@/views/register/Register.vue'),
            meta: { title: '注册' },
        },
    ],
})

// 路由守卫
router.beforeEach((to, _from) => {
    document.title = (to.meta.title as string) || '商城'
    const requiresAuth = to.meta.requiresAuth as boolean

    if (requiresAuth && isTokenExpired()) {
        // 未登录，跳转登录页
        return { name: 'Login', query: { redirect: to.fullPath } }
    } else if ((to.name === 'Login' || to.name === 'Register') && !isTokenExpired()) {
        // 已登录用户访问登录/注册页，跳转首页
        return { name: 'Home' }
    }
})

export default router
