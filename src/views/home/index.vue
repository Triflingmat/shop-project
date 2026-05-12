<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGoodsList } from '@/api/goods'
import { getCategoryList } from '@/api/category'
import GoodsCard from '@/components/GoodsCard.vue'
import type { Goods, Category } from '@/types'
import img1 from '@/assets/image/1.jpg'
import img2 from '@/assets/image/2.jpg'
import img3 from '@/assets/image/3.jpg'

const hotGoods = ref<Goods[]>([])
const categories = ref<Category[]>([])

// 轮播 Banner 图片
const banners = ref([
    { image: img1},
    { image: img2},
    { image: img3},
])

onMounted(async () => {
    try {
        const [goodsRes, catRes] = await Promise.all([
            getGoodsList({ pageNum: 1, pageSize: 16 }),
            getCategoryList({ pageNum: 1, pageSize: 100 }),
        ])
        hotGoods.value = (goodsRes.list || [])
            .filter((g: Goods) => Number(g.is_on_sale) === 1)
            .slice(0, 8)
        categories.value = catRes.list || []
    } catch {
        // 静默处理
    }
})
</script>

<template>
    <div class="home-page">
        <!-- Banner 轮播 -->
        <el-carousel :interval="4000" arrow="always" height="400px" class="banner-carousel">
            <el-carousel-item v-for="(item, i) in banners" :key="i">
                <div class="banner-slide">
                    <img :src="item.image" class="banner-img"/>
                </div>
            </el-carousel-item>
        </el-carousel>

        <!-- 分类导航 -->
        <section class="section" v-if="categories.length">
            <h2 class="section-title">商品分类</h2>
            <div class="category-grid">
                <div
                    v-for="cat in categories"
                    :key="cat.id"
                    class="category-item"
                    @click="$router.push({ name: 'GoodsList', query: { category: cat.name } })"
                >
                    <div class="cat-icon">📦</div>
                    <span>{{ cat.name }}</span>
                </div>
            </div>
        </section>

        <!-- 热销商品 -->
        <section class="section">
            <h2 class="section-title">热销推荐</h2>
            <div class="goods-grid">
                <GoodsCard v-for="goods in hotGoods" :key="goods.id" :goods="goods" />
            </div>
            <div v-if="hotGoods.length === 0" class="empty-tip">
                <p>暂无在售商品</p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home-page {
    margin: -20px -20px 0;
}
/* 轮播 */
.banner-carousel {
    margin-top : 20px;
    margin-bottom: 40px;
}
.banner-slide {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit:contain;
}
.banner-content {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    color: #fff;
}
.banner-content h1 { font-size: 42px; margin-bottom: 12px; font-weight: 700; }
.banner-content p { font-size: 20px; opacity: 0.9; margin-bottom: 28px; }
.section { margin-bottom: 40px; padding: 0 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
.section-title {
    font-size: 22px;
    color: #333;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 4px solid #e4393c;
}
.category-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}
.category-item {
    background: #fff;
    border-radius: 8px;
    padding: 20px 28px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid #f0f0f0;
    min-width: 100px;
}
.category-item:hover {
    border-color: #e4393c;
    color: #e4393c;
    transform: translateY(-2px);
}
.cat-icon { font-size: 28px; margin-bottom: 8px; }
.goods-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}
.empty-tip { text-align: center; padding: 40px; color: #999; }

@media (max-width: 900px) {
    .goods-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
    .goods-grid { grid-template-columns: 1fr; }
}
</style>
