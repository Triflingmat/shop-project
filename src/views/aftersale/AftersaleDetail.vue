<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAftersaleList } from '@/api/aftersale'
import type { AfterSales } from '@/types'

const route = useRoute()
const aftersale = ref<AfterSales | null>(null)

const typeMap: Record<number, string> = { 1: '仅退款', 2: '退货退款' }
const statusMap: Record<number, string> = {
    1: '待审核',
    2: '已通过',
    3: '已拒绝',
    4: '已完成',
}

const statusStepMap: Record<number, number> = {
    1: 0,
    2: 1,
    3: 1,
    4: 2,
}

onMounted(async () => {
    const id = Number(route.params.id)
    try {
        const res = await getAftersaleList({ pageNum: 1, pageSize: 100 })
        aftersale.value = (res.list || []).find((a) => a.id === id) || null
    } catch {
        // ignore
    }
})
</script>

<template>
    <div class="detail-page" v-if="aftersale">
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'UserProfile' }">售后记录</el-breadcrumb-item>
            <el-breadcrumb-item>售后详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="section">
            <template #header><span>售后进度</span></template>
            <el-steps :active="statusStepMap[aftersale.status]" align-center>
                <el-step title="提交申请" />
                <el-step title="审核中" />
                <el-step title="处理完成" />
            </el-steps>
        </el-card>

        <el-card class="section">
            <template #header><span>售后信息</span></template>
            <el-descriptions :column="2" border>
                <el-descriptions-item label="售后编号">{{ aftersale.id }}</el-descriptions-item>
                <el-descriptions-item label="关联订单">{{ aftersale.order_id }}</el-descriptions-item>
                <el-descriptions-item label="商品名称">{{ aftersale.goods_name }}</el-descriptions-item>
                <el-descriptions-item label="售后类型">{{ typeMap[aftersale.type] }}</el-descriptions-item>
                <el-descriptions-item label="退款金额">¥{{ aftersale.refund_price }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                    <el-tag :type="aftersale.status === 2 ? 'success' : aftersale.status === 3 ? 'danger' : 'warning'">
                        {{ statusMap[aftersale.status] }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="申请原因" :span="2">{{ aftersale.reason }}</el-descriptions-item>
                <el-descriptions-item label="审核备注" :span="2">
                    {{ aftersale.admin_note || '暂无' }}
                </el-descriptions-item>
                <el-descriptions-item label="申请时间">{{ aftersale.creat_time }}</el-descriptions-item>
            </el-descriptions>
        </el-card>

        <div class="actions">
            <el-button @click="$router.back()">返回</el-button>
        </div>
    </div>
    <div v-else class="empty">售后记录不存在</div>
</template>

<style scoped>
.breadcrumb { margin-bottom: 16px; }
.section { margin-bottom: 16px; }
.actions { display: flex; justify-content: flex-end; margin-top: 8px; }
.empty { text-align: center; padding: 80px; color: #999; }
</style>
