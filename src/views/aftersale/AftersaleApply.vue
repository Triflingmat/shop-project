<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderItems } from '@/api/order_item'
import { addAftersale } from '@/api/aftersale'
import { ElMessage } from 'element-plus'
import type { Orderitem } from '@/types'

const route = useRoute()
const router = useRouter()

const orderId = Number(route.params.orderId)
const items = ref<Orderitem[]>([])
const selectedItems = ref<Orderitem[]>([])
const aftersaleType = ref(1) // 1=仅退款, 2=退货退款
const reason = ref('')
const loading = ref(false)

onMounted(async () => {
    try {
        items.value = await getOrderItems(orderId)
    } catch {
        // ignore
    }
})

const refundPrice = computed(() => {
    return selectedItems.value
        .reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
        .toFixed(2)
})

const handleSelect = (rows: Orderitem[]) => {
    selectedItems.value = rows
}

const submit = async () => {
    if (selectedItems.value.length === 0) return ElMessage.warning('请选择售后商品')
    if (!reason.value.trim()) return ElMessage.warning('请填写申请原因')
    loading.value = true
    try {
        for (const item of selectedItems.value) {
            await addAftersale({
                order_id: orderId,
                goods_name: item.goods_name,
                type: aftersaleType.value,
                status: 1,
                refund_price: (parseFloat(item.price) * item.quantity).toFixed(2),
                reason: reason.value.trim(),
            })
        }
        ElMessage.success('提交成功，请等待审核')
        router.push('/user/profile')
    } catch (e: any) {
        ElMessage.error(e.message || '提交失败')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="apply-page">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'UserProfile' }">我的订单</el-breadcrumb-item>
            <el-breadcrumb-item :to="`/order/detail/${orderId}`">订单详情</el-breadcrumb-item>
            <el-breadcrumb-item>申请售后</el-breadcrumb-item>
        </el-breadcrumb>

        <h2 class="page-title">申请售后 — 订单 #{{ orderId }}</h2>

        <el-card class="section">
            <template #header><span>售后类型</span></template>
            <el-radio-group v-model="aftersaleType">
                <el-radio :value="1">仅退款</el-radio>
                <el-radio :value="2">退货退款</el-radio>
            </el-radio-group>
        </el-card>

        <el-card class="section">
            <template #header><span>选择商品（可多选）</span></template>
            <el-table :data="items" @selection-change="handleSelect" style="width:100%">
                <el-table-column type="selection" width="50" />
                <el-table-column label="商品" min-width="200">
                    <template #default="{ row }">{{ row.goods_name }}</template>
                </el-table-column>
                <el-table-column label="单价" width="100">
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

        <el-card class="section">
            <template #header><span>退款金额（自动计算）</span></template>
            <el-input :model-value="refundPrice" disabled>
                <template #prepend>¥</template>
            </el-input>
        </el-card>

        <el-card class="section">
            <template #header><span>申请原因</span></template>
            <el-input v-model="reason" type="textarea" :rows="3" placeholder="请详细描述售后原因" />
        </el-card>

        <div class="actions">
            <el-button @click="$router.back()">返回</el-button>
            <el-button type="danger" :loading="loading" @click="submit">提交申请</el-button>
        </div>
    </div>
</template>

<style scoped>
.breadcrumb { margin-bottom: 16px; }
.page-title { font-size: 20px; margin-bottom: 20px; color: #333; }
.section { margin-bottom: 16px; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
</style>
