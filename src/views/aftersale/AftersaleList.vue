<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAftersaleList } from '@/api/aftersale'
import type { AfterSales } from '@/types'

const list = ref<AfterSales[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 10

const typeMap: Record<number, string> = { 1: '仅退款', 2: '退货退款' }
const statusMap: Record<number, { label: string; type: string }> = {
    1: { label: '待审核', type: 'warning' },
    2: { label: '已通过', type: 'success' },
    3: { label: '已拒绝', type: 'danger' },
    4: { label: '已完成', type: 'info' },
}

const fetchList = async () => {
    try {
        const res = await getAftersaleList({ pageNum: pageNum.value, pageSize })
        list.value = res.list || []
        total.value = res.total
    } catch {
        // ignore
    }
}

onMounted(() => fetchList())

const onPageChange = (page: number) => {
    pageNum.value = page
    fetchList()
}
</script>

<template>
    <div class="aftersale-list">
        <h2 class="page-title">售后记录</h2>

        <div v-if="list.length === 0" class="empty">暂无售后记录</div>

        <template v-else>
            <el-table :data="list" style="width: 100%">
                <el-table-column prop="id" label="编号" width="70" />
                <el-table-column prop="order_id" label="订单号" width="90" />
                <el-table-column prop="goods_name" label="商品" min-width="150" />
                <el-table-column label="类型" width="100">
                    <template #default="{ row }">{{ typeMap[row.type] || '未知' }}</template>
                </el-table-column>
                <el-table-column label="退款金额" width="100">
                    <template #default="{ row }">¥{{ row.refund_price }}</template>
                </el-table-column>
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-tag :type="(statusMap[row.status]?.type || 'info') as any" size="small">
                            {{ statusMap[row.status]?.label || '未知' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="creat_time" label="申请时间" width="170" />
                <el-table-column label="操作" width="80">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="$router.push(`/aftersale/detail/${row.id}`)">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

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
.empty { text-align: center; padding: 80px; color: #999; background: #fff; border-radius: 8px; }
.pagination { display: flex; justify-content: center; margin-top: 20px; }
</style>
