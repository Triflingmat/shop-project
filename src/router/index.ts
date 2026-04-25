import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { isTokenExpired } from '@/utils/token'
import {ElMessage} from 'element-plus'
import Layout from '@/views/Layout.vue'
import Login from '@/views/login/Login.vue'
import AdminManage from '@/views/userAuth/AdminManage.vue'
import GoodsManage from '@/views/goods/GoodsManage.vue'
import CategoryManage from '@/views/goods/CategoryManage.vue'
import OrderManage from '@/views/order/OrderManage.vue'
import AftersaleManage from '@/views/aftersale/AftersaleManage.vue'
import PersonCenter from '@/views/PersonCenter.vue'
import UserManage from '@/views/userAuth/UserManage.vue'
import Home from '@/views/home/index.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name:'login',
      path:'/login',
      component:Login
    },
    {
      name:'layout',
      path:'/',
      component:Layout,
      redirect:'/home',
      children:[
        //主页
        {name: 'home',path: 'home',component: Home},
        //个人中心
        {name: 'personCenter',path: 'personCenter',component: PersonCenter},
        //用户相关
        {name: 'adminManage',path: 'adminManage',component: AdminManage},
        {name: 'userManage',path: 'userManage',component: UserManage},
        //商品相关
        {name: 'goodsManage',path: 'goodsManage',component: GoodsManage},
        {name:'categoryManage',path:'categoryManage',component: CategoryManage},
        //订单相关
        {name: 'orderManage',path: 'orderManage',component: OrderManage},
        //售后相关
        {name: 'aftersaleManage',path: 'aftersaleManage',component: AftersaleManage},
      ]
    },
  ],
})

router.beforeEach((to,form,next)=>{
  const userStore = useUserStore()
  userStore.loadUser() 
  if(to.name == 'login'){
    next();
  }else{
    userStore.isLogin?next():next('/login');
  }

  if(isTokenExpired()){
    next('/login');
    ElMessage.error('登录已过期，请重新登录');
    userStore.logout()
  }
})

export default router
