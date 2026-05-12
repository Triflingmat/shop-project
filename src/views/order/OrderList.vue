<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyOrderList, updateOrder, deleteOrder } from '@/api/order'
import OrderCard from '@/components/OrderCard.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 10
const currentMode = ref<number | undefined>(undefined)

const modeLabels: Record<number, string> = {
    1: '已取消',
    2: '已退款',
    3: '待支付',
    4: '待收货',
    5: '已完成',
}

const fetchOrders = async () => {
    try {
        const res = await getMyOrderList({
            pageNum: pageNum.value,
            pageSize,
            mode: currentMode.value,
        })
        orders.value = res.list || []
        total.value = res.total
    } catch {
        // ignore
    }
}

onMounted(() => fetchOrders())

const switchTab = (mode: number | undefined) => {
    currentMode.value = mode
    pageNum.value = 1
    fetchOrders()
}

const onPageChange = (page: number) => {
    pageNum.value = page
    fetchOrders()
}

const cancelOrder = async (order: Order) => {
    await ElMessageBox.confirm('确定取消该订单吗？', '提示', { type: 'warning' })
    try {
        await updateOrder({ id: order.id, state: 0 })
        ElMessage.success('已取消')
        fetchOrders()
    } catch (e: any) {
        ElMessage.error(e.message || '操作失败')
    }
}

const confirmReceive = async (order: Order) => {
    await ElMessageBox.confirm('确认已收到货吗？', '提示', { type: 'warning' })
    try {
        await updateOrder({ id: order.id, state: 4 })
        ElMessage.success('已确认收货')
        fetchOrders()
    } catch (e: any) {
        ElMessage.error(e.message || '操作失败')
    }
}

const removeOrder = async (id: number) => {
    await ElMessageBox.confirm('确定删除该订单吗？', '提示', { type: 'warning' })
    try {
        await deleteOrder(id)
        ElMessage.success('已删除')
        fetchOrders()
    } catch (e: any) {
        ElMessage.error(e.message || '删除失败')
    }
}
</script>

<template>
    <div class="order-list-page">
        <h2 class="page-title">我的订单</h2>

        <!-- 状态 Tab -->
        <div class="tabs">
            <span
                v-for="(label, mode) in { undefined: '全部', ...modeLabels }"
                :key="String(mode)"
                :class="{ active: currentMode === (mode === 'undefined' ? undefined : Number(mode)) }"
                @click="switchTab(mode === 'undefined' ? undefined : Number(mode))"
            >
                {{ label }}
            </span>
        </div>

        <div v-if="orders.length === 0" class="empty">暂无订单</div>

        <template v-else>
            <div v-for="order in orders" :key="order.id" class="order-wrapper">
                <OrderCard :order="order" @click="$router.push(`/order/detail/${order.id}`)" />
                <div class="order-actions">
                    <template v-if="order.state === 1">
                        <el-button size="small" @click="cancelOrder(order)">取消订单</el-button>
                        <el-button size="small" type="primary">去付款</el-button>
                    </template>
                    <el-button v-if="order.state === 3" size="small" type="success" @click="confirmReceive(order)">
                        确认收货
                    </el-button>
                    <el-button
                        v-if="order.state === 4"
                        size="small"
                        type="warning"
                        @click="$router.push(`/aftersale/apply/${order.id}`)"
                    >
                        申请售后
                    </el-button>
                    <el-button v-if="order.state === 0" size="small" type="danger" @click="removeOrder(order.id)">
                        删除
                    </el-button>
                </div>
            </div>

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
        </template>
    </div>
</template>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 20px; color: #333; }
.tabs {
    display: flex;
    gap: 0;
    margin-bottom: 16px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
}
.tabs span {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}
.tabs span:hover { color: #e4393c; }
.tabs span.active { color: #e4393c; border-bottom-color: #e4393c; font-weight: 600; }
.empty { text-align: center; padding: 80px; color: #999; background: #fff; border-radius: 8px; }
.order-wrapper { margin-bottom: 8px; }
.order-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 20px 16px;
    background: #fff;
    border-radius: 0 0 8px 8px;
    margin-bottom: 12px;
}
.pagination { display: flex; justify-content: center; margin-top: 20px; }
</style>
