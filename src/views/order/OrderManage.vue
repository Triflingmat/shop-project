<template>
    <!--    html    -->
     <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item>
        <a>订单信息</a>
        </el-breadcrumb-item>
    </el-breadcrumb>
      <el-tabs type="border-card" style="margin-top: 20px;" v-model="mode">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <OrderTable
            :table-data="tableData"
            v-model:search="search"
            @details="showDetails"
          />
             <div class="page">   
          <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            size="default"
            layout="prev, pager, next, jumper"
            @size-change="GetOrderData"
            @current-change="GetOrderData"
            :total="total"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogTableVisible" title="购买详情" width="800">
    <el-table :data="orderitemData">
      <el-table-column property="goods_id" label="商品ID" />
      <el-table-column property="goods_name" label="商品名称" />
      <el-table-column property="quantity" label="商品数量" />
      <el-table-column property="price" label="小计金额"></el-table-column>
    </el-table>
      <template #footer>
        <h2>总金额:{{ form.total_amount }}</h2>
      </template>
  </el-dialog>

    <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>订单详情</h4>
    </template>
    <template #default>
      <el-form :model="form">
        <el-form-item label="订单号：">{{ form.id }}</el-form-item>
        <el-form-item label="下单用户ID：">{{ form.user_id }}</el-form-item>
        <el-form-item label="下单用户名：">{{ form.username }}</el-form-item>
        <el-form-item label="下单用户联系方式：">{{ form.phone }}</el-form-item>
        <el-form-item label="下单用户地址：">{{ form.address }}</el-form-item>
        <el-form-item label="订单状态：">
          <el-tag :type="stateMap[form.state]?.type || 'info'">
            {{ stateMap[form.state]?.text }}
          </el-tag>
        </el-form-item>
        <el-form-item label="购买商品："><el-button @click="showOrderitem" type="primary">查看详情</el-button></el-form-item>
        <el-form-item label="订单总金额：">{{ form.total_amount }}</el-form-item>
        <el-form-item label="订单创建时间：">{{ form.create_time }}</el-form-item>
        <el-form-item label="订单备注：">{{ form.remark }}</el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
      </div>
    </template>
  </el-drawer>

</template>

<script lang="ts" setup name="OrderManage">
//JS
import {ref,onMounted, watch} from 'vue'
import type { Order,Orderitem} from '@/types';
import {getOrderData} from '@/api/order'
import { RetrieveData } from '@/utils/crud';
import OrderTable from '@/components/OrderTable.vue';
import { getOrderitemData } from '@/api/order_item';
import { ElMessage } from 'element-plus'

const tabList = ref([
  { label: '全部订单', name: 0 },
  { label: '已取消', name: 1 },
  { label: '已退款', name: 2 },
  { label: '待支付', name: 3 },
  { label: '待收货', name: 4 },
  { label: '已完成', name: 5 },
])

//获取数据
const search = ref('')
const tableData = ref<Order[]>([])
const pageNum = ref(1)
const pageSize = ref(14)
const total = ref(1)
const mode = ref(0)


const dialogTableVisible = ref(false)
const showOrderitem = ()=>{
  dialogTableVisible.value=true
  GetOrderitemData()
}

const orderitemData = ref<Orderitem[]>([])
const GetOrderitemData = async()=>{
  let res = await getOrderitemData(form.value.id)
  console.log("购买详情",res)
  if(!res){
  alert("未连接至服务器！");
  }
  if(res.code === 200){
    ElMessage({
      message: '成功获取！',
      type: 'success',
    })
    orderitemData.value = res.data
  }else{
        ElMessage.error("发生错误！")
  }    
}



const GetOrderData = async ()=>{
  RetrieveData(
      getOrderData,
      tableData,
      pageNum,
      pageSize,
      mode,
      total
  )
}

const drawer = ref(false)
const form = ref<Order>({} as Order)
const showDetails = (row:Order)=>{
  drawer.value = true
  form.value = row
}
const cancelClick = ()=>{drawer.value = false}

const stateMap: Record<string | number, { type: string; text: string }> = {
  1: { type: 'danger', text: '已取消' },
  2: { type: 'info', text: '已退款' },
  3: { type: 'warning', text: '待支付' },
  4: { type: 'primary', text: '待收货' },
  5: { type: 'success', text: '已完成' },
}

watch(mode, () => {
  GetOrderData()
})

onMounted(()=>{
    GetOrderData()
})
</script>

<style>
    /* CSS */

</style>