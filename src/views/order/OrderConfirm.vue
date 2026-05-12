<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { createOrder } from '@/api/order'
import { addOrderItem } from '@/api/order_item'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const remark = ref('')
const loading = ref(false)

const selectedItems = computed(() => cartStore.selectedItems)
const totalPrice = computed(() => cartStore.totalPrice)

const submitOrder = async () => {
    if (!userStore.userInfo) return
    loading.value = true
    try {
        // 构建商品名称列表
        const goodsNames = selectedItems.value.map((i) => i.goods_name).join('、')

        const newOrder = await createOrder({
            user_id: userStore.userInfo.id,
            username: userStore.userInfo.username,
            phone: userStore.userInfo.phone || '',
            address: userStore.userInfo.address || '',
            total_amount: totalPrice.value.toFixed(2),
            remark: remark.value,
            state: 3,
        })

        // 获取新订单 ID（兼容后端是否回填）
        const orderId = (newOrder as any).id
        if (!orderId) {
            throw new Error('订单创建成功但未返回ID，请联系管理员')
        }

        // 同步创建订单明细
        for (const item of selectedItems.value) {
            await addOrderItem({
                order_id: orderId,
                goods_id: item.goods_id,
                goods_name: item.goods_name,
                price: item.price,
                quantity: item.quantity,
            })
        }

        ElMessage.success('下单成功')
        cartStore.clearSelected()
        router.push('/user/profile')
    } catch (e: any) {
        ElMessage.error(e.message || '下单失败')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="confirm-page">
        <h2 class="page-title">确认订单</h2>

        <!-- 收货地址 -->
        <el-card class="section">
            <template #header>
                <span>收货地址</span>
            </template>
            <div v-if="userStore.userInfo">
                <p><strong>{{ userStore.userInfo.username }}</strong> — {{ userStore.userInfo.phone }}</p>
                <p>{{ userStore.userInfo.address || '未填写收货地址，请到个人中心补充' }}</p>
            </div>
        </el-card>

        <!-- 商品清单 -->
        <el-card class="section">
            <template #header>
                <span>商品清单</span>
            </template>
            <el-table :data="selectedItems" style="width: 100%">
                <el-table-column label="商品" min-width="300">
                    <template #default="{ row }">
                        <div style="display:flex;align-items:center;gap:10px">
                            <img :src="row.goods_img" style="width:50px;height:50px;object-fit:cover;border-radius:4px" />
                            <span>{{ row.goods_name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="单价" width="120">
                    <template #default="{ row }">¥{{ row.price }}</template>
                </el-table-column>
                <el-table-column label="数量" width="80">
                    <template #default="{ row }">{{ row.quantity }}</template>
                </el-table-column>
                <el-table-column label="小计" width="120">
                    <template #default="{ row }">
                        ¥{{ (parseFloat(row.price) * row.quantity).toFixed(2) }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 备注 -->
        <el-card class="section">
            <template #header><span>订单备注</span></template>
            <el-input v-model="remark" placeholder="选填，给卖家的留言" type="textarea" :rows="2" />
        </el-card>

        <!-- 价格汇总 -->
        <div class="price-summary">
            <span>共 {{ cartStore.totalCount }} 件，合计：</span>
            <span class="total">¥{{ totalPrice.toFixed(2) }}</span>
        </div>

        <div class="submit-row">
            <el-button @click="$router.back()">返回</el-button>
            <el-button type="danger" size="large" :loading="loading" @click="submitOrder">
                提交订单
            </el-button>
        </div>
    </div>
</template>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 20px; color: #333; }
.section { margin-bottom: 16px; }
.price-summary { text-align: right; padding: 16px 0; font-size: 16px; color: #666; }
.total { font-size: 24px; font-weight: 700; color: #e4393c; margin-left: 8px; }
.submit-row { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
</style>
