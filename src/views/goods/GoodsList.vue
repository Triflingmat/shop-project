<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useInfiniteScroll } from '@vueuse/core'
import { getGoodsList } from '@/api/goods'
import { getCategoryList } from '@/api/category'
import GoodsCard from '@/components/GoodsCard.vue'
import type { Category } from '@/types'
import type { Goods } from '@/types'

const route = useRoute()
const goodsList = ref<Goods[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 12
const keyword = ref('')
const activeCategory = ref('')
const loading = ref(false)
const noMore = ref(false)

// 是否还有更多数据
const hasMore = computed(() => goodsList.value.length < total.value)

// 重置并重新加载
const resetAndLoad = () => {
    pageNum.value = 1
    goodsList.value = []
    total.value = 0
    noMore.value = false
    loadGoods()
}

onMounted(() => {
    keyword.value = (route.query.keyword as string) || ''
    activeCategory.value = (route.query.category as string) || ''
    fetchCategories()
    resetAndLoad()
})

// 监听路由 query 变化，重新加载
watch(
    () => [route.query.keyword, route.query.category],
    () => {
        keyword.value = (route.query.keyword as string) || ''
        activeCategory.value = (route.query.category as string) || ''
        resetAndLoad()
    }
)

const fetchCategories = async () => {
    try {
        const res = await getCategoryList()
        categories.value = res.list || []
    } catch { /* ignore */ }
}

/** 加载一页数据（追加模式） */
const loadGoods = async () => {
    if (loading.value || noMore.value) return
    loading.value = true
    try {
        let mode = 0
        if (activeCategory.value) {
            const cat = categories.value.find((c) => c.name === activeCategory.value)
            if (cat) mode = cat.id
        }

        const res = await getGoodsList({
            pageNum: pageNum.value,
            pageSize,
            mode,
            name: keyword.value || '',
        })

        const onSale = (res.list || []).filter((g: Goods) => Number(g.is_on_sale) === 1)

        // 如果返回空列表，说明没有更多数据了
        if (onSale.length === 0) {
            noMore.value = true
            if (pageNum.value === 1) goodsList.value = []
        } else if (pageNum.value === 1) {
            goodsList.value = onSale
        } else {
            goodsList.value.push(...onSale)
        }

        total.value = res.total || 0

        // 已加载数量 >= 总数时，标记没有更多
        if (goodsList.value.length >= total.value || onSale.length === 0) {
            noMore.value = true
        } else {
            pageNum.value++
        }
    } catch {
        // 请求失败时停止继续加载
        noMore.value = true
        if (pageNum.value === 1) goodsList.value = []
    } finally {
        loading.value = false
    }
}

// ========== 无限滚动 ==========
// 距离底部 200px 时自动加载下一页
useInfiniteScroll(
    document,
    () => {
        if (!loading.value && hasMore.value) {
            loadGoods()
        }
    },
    { distance: 200 }
)
</script>

<template>
    <div class="goods-list-page">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content">
            <!-- 左侧分类 -->
            <aside class="sidebar">
                <h3>商品分类</h3>
                <ul>
                    <li
                        :class="{ active: !activeCategory }"
                        @click="$router.push({ name: 'GoodsList' })"
                    >
                        全部
                    </li>
                    <li
                        v-for="cat in categories"
                        :key="cat.id"
                        :class="{ active: activeCategory === cat.name }"
                        @click="$router.push({ name: 'GoodsList', query: { category: cat.name } })"
                    >
                        {{ cat.name }}
                    </li>
                </ul>
            </aside>

            <!-- 右侧商品 -->
            <div class="main">
                <div class="toolbar">
                    <span class="total">共 {{ total }} 件商品</span>
                </div>
                <div class="goods-grid" v-if="goodsList.length">
                    <GoodsCard v-for="g in goodsList" :key="g.id" :goods="g" />
                </div>
                <div v-else-if="!loading" class="empty">
                    <template v-if="keyword">
                        未找到与"{{ keyword }}"相关的商品
                    </template>
                    <template v-else>
                        暂无商品
                    </template>
                </div>
                <!-- 加载提示 -->
                <div v-if="loading" class="load-more">
                    <span class="spinner" />
                    <span>加载中...</span>
                </div>
                <div v-else-if="noMore && goodsList.length > 0" class="load-more no-more">
                    — 已经到底了 —
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.breadcrumb { margin-bottom: 16px; }
.content { display: flex; gap: 20px; }
.sidebar {
    width: 200px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
}
.sidebar h3 { font-size: 16px; margin-bottom: 12px; color: #333; }
.sidebar ul { list-style: none; padding: 0; }
.sidebar li {
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
}
.sidebar li:hover { background: #fff0f0; color: #e4393c; }
.sidebar li.active { background: #e4393c; color: #fff; }
.main { flex: 1; min-height: 400px; }
.toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px;
}
.total { font-size: 14px; color: #666; }
.keyword-hint { font-size: 14px; color: #e4393c; }
.goods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
.empty {
    text-align: center;
    padding: 80px 0;
    color: #999;
    font-size: 15px;
    background: #fff;
    border-radius: 8px;
}

/* 加载更多 */
.load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    color: #999;
    font-size: 14px;
}
.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #e0e0e0;
    border-top-color: #e4393c;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
.no-more {
    color: #ccc;
    font-size: 13px;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
    .goods-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
    .content { flex-direction: column; }
    .sidebar { width: 100%; }
    .goods-grid { grid-template-columns: 1fr; }
}
</style>
