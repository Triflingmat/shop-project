<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import QuantitySelector from '@/components/QuantitySelector.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
    cartStore.fetchCart()
})

const removeItem = (cartId: number) => {
    ElMessageBox.confirm('确定要移除该商品吗？', '提示', { type: 'warning' }).then(async () => {
        await cartStore.removeItem(cartId)
        ElMessage.success('已移除')
    }).catch(() => {})
}

const clearCart = () => {
    ElMessageBox.confirm('确定要清空购物车吗？', '提示', { type: 'warning' }).then(async () => {
        await cartStore.clearCart()
        ElMessage.success('已清空')
    }).catch(() => {})
}

const goCheckout = () => {
    if (cartStore.selectedItems.length === 0) {
        ElMessage.warning('请先选择商品')
        return
    }
    router.push('/order/confirm')
}
</script>

<template>
    <div class="cart-page">
        <h2 class="page-title">购物车</h2>

        <div v-if="cartStore.items.length === 0" class="empty-cart">
            <p>购物车是空的</p>
            <el-button type="danger" @click="$router.push('/goods/list')">去逛逛</el-button>
        </div>

        <template v-else>
            <div class="cart-table">
                <div class="cart-header">
                    <span class="col-check">
                        <el-checkbox
                            :model-value="cartStore.items.every(i => i.checked === 1)"
                            :indeterminate="cartStore.items.some(i => i.checked === 1) && !cartStore.items.every(i => i.checked === 1)"
                            @change="cartStore.toggleSelectAll()"
                        />
                    </span>
                    <span class="col-goods">商品</span>
                    <span class="col-price">单价</span>
                    <span class="col-qty">数量</span>
                    <span class="col-subtotal">小计</span>
                    <span class="col-action">操作</span>
                </div>

                <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
                    <span class="col-check">
                        <el-checkbox :model-value="item.checked === 1" @change="cartStore.toggleSelect(item.id)" />
                    </span>
                    <span class="col-goods">
                        <img :src="item.goods_img" class="item-img" />
                        <span class="item-name">{{ item.goods_name }}</span>
                    </span>
                    <span class="col-price">¥{{ item.price }}</span>
                    <span class="col-qty">
                        <QuantitySelector
                            :model-value="item.quantity"
                            :max="999"
                            @update:model-value="(v: number) => cartStore.updateQuantity(item.id, item.goods_id, v, item.checked)"
                        />
                    </span>
                    <span class="col-subtotal">
                        ¥{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
                    </span>
                    <span class="col-action">
                        <el-button type="danger" link @click="removeItem(item.id)">删除</el-button>
                    </span>
                </div>
            </div>

            <div class="cart-footer">
                <div class="footer-left">
                    <el-checkbox
                        :model-value="cartStore.items.every(i => i.checked === 1)"
                        :indeterminate="cartStore.items.some(i => i.checked === 1) && !cartStore.items.every(i => i.checked === 1)"
                        @change="cartStore.toggleSelectAll()"
                    >
                        全选
                    </el-checkbox>
                    <el-button type="danger" link @click="clearCart">清空购物车</el-button>
                </div>
                <div class="footer-right">
                    <span class="total-info">
                        已选 <em>{{ cartStore.totalCount }}</em> 件，合计
                        <em class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</em>
                    </span>
                    <el-button type="danger" size="large" @click="goCheckout">
                        去结算
                    </el-button>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 20px; color: #333; }
.empty-cart { text-align: center; padding: 80px; background: #fff; border-radius: 8px; }
.empty-cart p { font-size: 18px; color: #999; margin-bottom: 20px; }
.cart-table { background: #fff; border-radius: 8px 8px 0 0; }
.cart-header, .cart-item {
    display: flex;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid #f0f0f0;
}
.cart-header { background: #fafafa; font-size: 13px; color: #999; }
.col-check { width: 40px; text-align: center; }
.col-goods { flex: 1; display: flex; align-items: center; gap: 12px; }
.col-price, .col-qty, .col-subtotal, .col-action { width: 120px; text-align: center; }
.item-img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; background: #f5f5f5; }
.item-name { font-size: 14px; color: #333; }
.col-price { font-size: 14px; color: #333; }
.col-subtotal { font-size: 14px; color: #e4393c; font-weight: 600; }
.cart-footer {
    background: #fff;
    border-radius: 0 0 8px 8px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.footer-left { display: flex; align-items: center; gap: 20px; }
.footer-right { display: flex; align-items: center; gap: 16px; }
.total-info { font-size: 14px; color: #666; }
.total-info em { font-style: normal; font-weight: 700; color: #e4393c; }
.total-price { font-size: 20px !important; }
</style>
