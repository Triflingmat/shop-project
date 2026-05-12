<script setup lang="ts">
import type { Order } from '@/types'
import { useRouter } from 'vue-router'

const props = defineProps<{
    order: Order
}>()

const emit = defineEmits<{
    cancel: [order: Order]
    pay: [order: Order]
    confirm: [order: Order]
    remove: [id: number]
    aftersale: [orderId: number]
}>()

const router = useRouter()

const stateMap: Record<number, { label: string; type: string }> = {
    1: { label: '已取消', type: 'info' },
    2: { label: '已退款', type: 'info' },
    3: { label: '待支付', type: 'warning' },
    4: { label: '待收货', type: '' },
    5: { label: '已完成', type: 'success' },
}

const goDetail = () => {
    router.push(`/order/detail/${props.order.id}`)
}
</script>

<template>
    <div class="order-card" @click="goDetail">
        <div class="order-header">
            <span class="order-id">订单号：{{ order.id }}</span>
            <span class="order-time">{{ order.create_time }}</span>
            <el-tag
                :type="(stateMap[order.state]?.type || 'info') as any"
                size="small"
            >
                {{ stateMap[order.state]?.label || '未知' }}
            </el-tag>
        </div>
        <div class="order-body">
            <div class="order-info">
                <p>收货人：{{ order.username }}</p>
                <p>总金额：<span class="order-amount">¥{{ order.total_amount }}</span></p>
            </div>
            <div class="order-actions" @click.stop>
                <template v-if="order.state === 3">
                    <el-button size="small" @click="emit('cancel', order)">取消订单</el-button>
                    <el-button size="small" type="primary" @click="emit('pay', order)">去付款</el-button>
                </template>
                <el-button v-if="order.state === 4" size="small" type="success" @click="emit('confirm', order)">确认收货</el-button>
                <el-button v-if="order.state === 5" size="small" type="warning" @click="emit('aftersale', order.id)">申请售后</el-button>
                <el-button v-if="order.state === 1 || order.state === 2" size="small" type="danger" @click="emit('remove', order.id)">删除</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: box-shadow 0.2s;
    border: 1px solid #ebeef5;
}
.order-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.order-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
}
.order-id {
    font-size: 14px;
    color: #666;
}
.order-time {
    font-size: 13px;
    color: #999;
    flex: 1;
}
.order-body {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 12px;
}
.order-info p {
    margin: 4px 0;
    font-size: 13px;
    color: #666;
}
.order-amount {
    font-size: 18px;
    font-weight: 700;
    color: #e4393c;
}
.order-actions {
    display: flex;
    gap: 8px;
}
</style>
