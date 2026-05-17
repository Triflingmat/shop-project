<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { Goods } from '@/types'

defineProps<{
    goods: Goods
}>()

// 图片懒加载：进入视口后才加载
const imgRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

useIntersectionObserver(
    imgRef,
    (entries) => {
        if (entries[0]?.isIntersecting) {
            isLoaded.value = true
        }
    },
    { rootMargin: '200px' }
)
</script>

<template>
    <div class="goods-card" @click="$router.push(`/goods/detail/${goods.id}`)">
        <div class="card-img">
            <img
                v-if="isLoaded"
                :src="goods.goods_img"
                :alt="goods.name"
                loading="lazy"
            />
            <div v-else class="img-placeholder" ref="imgRef">
                <span>📷</span>
            </div>
            <div v-if="!goods.is_on_sale" class="off-sale-mask">已下架</div>
        </div>
        <div class="card-info">
            <h3 class="card-name">{{ goods.name }}</h3>
            <div class="card-bottom">
                <span class="card-price">¥{{ goods.price }}</span>
                <span class="card-stock">库存: {{ goods.stock }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.goods-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}
.goods-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.card-img {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f0f0f0;
}
.card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
}
.off-sale-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
}
.card-info {
    padding: 12px;
}
.card-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-price {
    font-size: 18px;
    font-weight: 700;
    color: #e4393c;
}
.card-stock {
    font-size: 12px;
    color: #999;
}
</style>
