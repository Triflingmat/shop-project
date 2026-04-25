<template>
  <el-table :data="filterTableData" style="width: 100%; margin-top: 10px;">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="下单用户" prop="username" />
    <el-table-column label="总金额" prop="total_amount" />
    <el-table-column label="订单状态" prop="state">
      <template #default="scope">
        <el-tag :type="stateMap[scope.row.state]?.type || 'info'">
          {{ stateMap[scope.row.state]?.text || '未知状态' }}
        </el-tag>
      </template>
    </el-table-column>
        <el-table-column label="创建时间" prop="create_time" />
    <el-table-column align="right">
      <template #header>
        <div style="display: flex;">
          <el-input v-model="searchValue" size="small" placeholder="搜索下单用户" />
        </div>
      </template>
      <template #default="scope">
        <el-button size="small" @click="$emit('details', scope.row)">订单详情</el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/types'

const searchValue = computed({
  get: () => props.search,
  set: (val) => emit('update:search', val)
})
const props = defineProps<{
  tableData: Order[]
  search: string
}>()

const emit = defineEmits<{
  details: [row: Order]
  'update:search': [value: string]
}>()

const filterTableData = computed(() =>
    props.tableData.filter(
        (data:Order) =>
        (!props.search ||
        data.username.toLowerCase().includes(props.search.toLowerCase()))
))

const stateMap: Record<string | number, { type: string; text: string }> = {
  1: { type: 'danger', text: '已取消' },
  2: { type: 'info', text: '已退款' },
  3: { type: 'warning', text: '待支付' },
  4: { type: 'primary', text: '待收货' },
  5: { type: 'success', text: '已完成' },
}

</script>

<style scoped>
    /* CSS */

</style>