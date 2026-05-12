<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGoodsList } from '@/api/goods'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import QuantitySelector from '@/components/QuantitySelector.vue'
import { ElMessage } from 'element-plus'
import type { Goods } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const goods = ref<Goods | null>(null)
const quantity = ref(1)

onMounted(async () => {
    const id = Number(route.params.id)
    try {
        const res = await getGoodsList({ pageNum: 1, pageSize: 100 })
        goods.value = (res.list || []).find((g) => g.id === id) || null
    } catch {
        // ignore
    }
})

const addToCart = () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push('/login')
        return
    }
    if (!goods.value) return
    cartStore.addItem(goods.value, quantity.value)
    ElMessage.success('已加入购物车')
}

const buyNow = () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push('/login')
        return
    }
    if (!goods.value) return
    cartStore.addItem(goods.value, quantity.value)
    router.push('/cart')
}
</script>

<template>
    <div class="detail-page" v-if="goods">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'GoodsList' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{ goods.name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="detail-card">
            <div class="img-section">
                <img :src="goods.goods_img" :alt="goods.name" />
            </div>
            <div class="info-section">
                <h1 class="goods-name">{{ goods.name }}</h1>
                <p class="goods-price">¥{{ goods.price }}</p>
                <div class="goods-meta">
                    <span>库存：{{ goods.stock }} 件</span>
                    <span v-if="goods.is_on_sale" style="color: #67c23a">在售</span>
                    <span v-else style="color: #f56c6c">已下架</span>
                </div>
                <div class="goods-desc">
                    <h4>商品描述</h4>
                    <p>{{ goods.goods_desc || '暂无描述' }}</p>
                </div>
                <div class="qty-row">
                    <span>数量</span>
                    <QuantitySelector v-model="quantity" :max="goods.stock" />
                </div>
                <div class="btn-row">
                    <el-button
                        type="danger"
                        size="large"
                        :disabled="!goods.is_on_sale || goods.stock === 0"
                        @click="buyNow"
                    >
                        立即购买
                    </el-button>
                    <el-button
                        type="warning"
                        size="large"
                        :disabled="!goods.is_on_sale || goods.stock === 0"
                        @click="addToCart"
                    >
                        加入购物车
                    </el-button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="empty">商品不存在</div>
</template>

<style scoped>
.breadcrumb { margin-bottom: 16px; }
.detail-card {
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    display: flex;
    gap: 40px;
}
.img-section {
    width: 420px;
    height: 420px;
    flex-shrink: 0;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
}
.img-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.info-section { flex: 1; }
.goods-name { font-size: 22px; color: #333; margin-bottom: 16px; }
.goods-price { font-size: 28px; color: #e4393c; font-weight: 700; margin-bottom: 16px; }
.goods-meta { display: flex; gap: 24px; font-size: 14px; color: #999; margin-bottom: 20px; }
.goods-desc { background: #fafafa; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
.goods-desc h4 { margin-bottom: 8px; color: #333; }
.goods-desc p { font-size: 14px; color: #666; line-height: 1.8; }
.qty-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; font-size: 14px; color: #333; }
.btn-row { display: flex; gap: 16px; }
.empty { text-align: center; padding: 80px; color: #999; }
</style>
