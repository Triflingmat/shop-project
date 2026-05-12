<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMyOrderList, updateOrder, deleteOrder } from '@/api/order'
import { getOrderItems } from '@/api/order_item'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Order, Orderitem } from '@/types'

const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)
const items = ref<Orderitem[]>([])

const stateStepMap: Record<number, { title: string; active: number }> = {
    1: { title: '已取消', active: -1 },
    2: { title: '已退款', active: -1 },
    3: { title: '待支付', active: 1 },
    4: { title: '待收货', active: 2 },
    5: { title: '已完成', active: 3 },
}

const steps = ['已下单', '待支付', '待收货', '已完成']

onMounted(async () => {
    const id = Number(route.params.id)
    try {
        const res = await getMyOrderList({ pageNum: 1, pageSize: 100 })
        order.value = (res.list || []).find((o) => o.id === id) || null
    } catch {
        // ignore
    }
    if (order.value) {
        try {
            items.value = await getOrderItems(order.value.id)
        } catch {
            items.value = []
        }
    }
})

const payOrder = async () => {
    if (!order.value) return
    try {
        await updateOrder({ id: order.value.id, state: 4 })
        order.value.state = 4
        ElMessage.success('付款成功')
    } catch (e: any) {
        ElMessage.error(e.message || '操作失败')
    }
}

const cancelOrder = async () => {
    if (!order.value) return
    await ElMessageBox.confirm('确定取消该订单吗？', '提示', { type: 'warning' })
    try {
        await updateOrder({ id: order.value.id, state: 1 })
        order.value.state = 1
        ElMessage.success('已取消')
    } catch (e: any) {
        ElMessage.error(e.message || '操作失败')
    }
}

const confirmReceive = async () => {
    if (!order.value) return
    await ElMessageBox.confirm('确认已收到货吗？', '提示', { type: 'warning' })
    try {
        await updateOrder({ id: order.value.id, state: 5 })
        order.value.state = 5
        ElMessage.success('已确认收货')
    } catch (e: any) {
        ElMessage.error(e.message || '操作失败')
    }
}

const removeOrder = async () => {
    if (!order.value) return
    await ElMessageBox.confirm('确定删除该订单吗？', '提示', { type: 'warning' })
    try {
        await deleteOrder(order.value.id)
        ElMessage.success('已删除')
        router.push('/user/profile')
    } catch (e: any) {
        ElMessage.error(e.message || '删除失败')
    }
}
</script>

<template>
    <div class="detail-page" v-if="order">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'UserProfile' }">我的订单</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="section">
            <template #header><span>订单状态</span></template>
            <el-steps :active="stateStepMap[order.state]?.active ?? -1" align-center>
                <el-step v-for="s in steps" :key="s" :title="s" />
            </el-steps>
        </el-card>

        <el-card class="section">
            <template #header><span>收货信息</span></template>
            <p><strong>{{ order.username }}</strong> — {{ order.phone }}</p>
            <p>{{ order.address }}</p>
        </el-card>

        <el-card class="section">
            <template #header><span>商品明细</span></template>
            <el-table :data="items" style="width: 100%">
                <el-table-column label="商品" min-width="250">
                    <template #default="{ row }">{{ row.goods_name }}</template>
                </el-table-column>
                <el-table-column label="单价" width="100">
                    <template #default="{ row }">¥{{ row.price }}</template>
                </el-table-column>
                <el-table-column label="数量" width="80">
                    <template #default="{ row }">{{ row.quantity }}</template>
                </el-table-column>
                <el-table-column label="小计" width="100">
                    <template #default="{ row }">
                        ¥{{ (parseFloat(row.price) * row.quantity).toFixed(2) }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-card class="section" v-if="order.remark">
            <template #header><span>备注</span></template>
            <p>{{ order.remark }}</p>
        </el-card>

        <div class="price-summary">
            <span>订单总额：</span>
            <span class="total">¥{{ order.total_amount }}</span>
        </div>

        <div class="actions">
            <template v-if="order.state === 3">
                <el-button @click="cancelOrder">取消订单</el-button>
                <el-button type="primary" @click="payOrder">去付款</el-button>
            </template>
            <el-button v-if="order.state === 4" type="success" @click="confirmReceive">确认收货</el-button>
            <el-button
                v-if="order.state === 5"
                type="warning"
                @click="$router.push(`/aftersale/apply/${order.id}`)"
            >
                申请售后
            </el-button>
            <el-button v-if="order.state === 1 || order.state === 2" type="danger" @click="removeOrder">删除订单</el-button>
        </div>
    </div>
    <div v-else class="empty">订单不存在</div>
</template>

<style scoped>
.breadcrumb { margin-bottom: 16px; }
.section { margin-bottom: 16px; }
.price-summary { text-align: right; padding: 16px 0; font-size: 16px; color: #666; }
.total { font-size: 24px; font-weight: 700; color: #e4393c; margin-left: 8px; }
.actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.empty { text-align: center; padding: 80px; color: #999; }
</style>
