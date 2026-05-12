<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getGoodsList } from '@/api/goods'
import { getCategoryList } from '@/api/category'
import GoodsCard from '@/components/GoodsCard.vue'
import type { Goods, Category } from '@/types'

const route = useRoute()
const goods = ref<Goods[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 12
const keyword = ref('')
const activeCategory = ref('')

onMounted(() => {
    keyword.value = (route.query.keyword as string) || ''
    activeCategory.value = (route.query.category as string) || ''
    fetchGoods()
    fetchCategories()
})

watch(
    () => route.query,
    (query) => {
        keyword.value = (query.keyword as string) || ''
        activeCategory.value = (query.category as string) || ''
        pageNum.value = 1
        fetchGoods()
    }
)

const fetchGoods = async () => {
    try {
        // 一次性获取全量商品，客户端做分类筛选 + 分页
        const res = await getGoodsList({
            pageNum: 1,
            pageSize: 999,
            name: keyword.value || undefined,
        })
        let list = res.list || []

        // 前端按分类名筛选
        if (activeCategory.value) {
            const cat = categories.value.find((c) => c.name === activeCategory.value)
            if (cat) {
                list = list.filter((g) => g.category_id === cat.id)
            }
        }
        // 只展示上架商品
        list = list.filter((g) => Number(g.is_on_sale) === 1)

        // 基于筛选后的数据重新计算总数 + 客户端分页
        total.value = list.length
        const start = (pageNum.value - 1) * pageSize
        goods.value = list.slice(start, start + pageSize)
    } catch {
        // ignore
    }
}

const fetchCategories = async () => {
    try {
        const res = await getCategoryList()
        categories.value = res.list || []
    } catch {
        // ignore
    }
}

const onPageChange = (page: number) => {
    pageNum.value = page
    fetchGoods()
}
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
                <div class="goods-grid" v-if="goods.length">
                    <GoodsCard v-for="g in goods" :key="g.id" :goods="g" />
                </div>
                <div v-else class="empty">暂无商品</div>
                <div class="pagination" v-if="total > pageSize">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="pageSize"
                        :current-page="pageNum"
                        @current-change="onPageChange"
                    />
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
.main { flex: 1; }
.toolbar {
    background: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}
.total { font-size: 13px; color: #999; }
.goods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
.empty { text-align: center; padding: 60px; color: #999; background: #fff; border-radius: 8px; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }

@media (max-width: 900px) {
    .goods-grid { grid-template-columns: repeat(2, 1fr); }
    .sidebar { display: none; }
}
@media (max-width: 600px) {
    .goods-grid { grid-template-columns: 1fr; }
}
</style>
