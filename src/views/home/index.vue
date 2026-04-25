<template>
  <h3 style="margin-top: -10px;">主页控制台</h3>
  <el-row justify="space-around" :gutter="40">
    <el-col :span="6">
      <div  class="card"  style="height: 220px;">
        <div style="display: flex;justify-content:center;"><el-statistic title="总用户量" :value="userValue" /></div>
        <hr class="line">
        <div style="display: flex;justify-content: space-between;"><h4>总用户量</h4><h4>{{ userData.length }}</h4></div>
      </div>
    </el-col>
    <el-col :span="6">
      <div  class="card"  style="height: 220px;">
        <div style="display: flex;justify-content:center;"><el-statistic title="总订单量" :value="orderValue" /></div>
        <hr class="line">
        <div style="display: flex;justify-content: space-between;"><h4>转化率</h4><h4>{{ transform.toFixed(2) }}%</h4></div>
      </div>
    </el-col>
    <el-col :span="6">
      <div  class="card"  style="height: 220px;">
      <div style="display: flex;justify-content:center;"><el-statistic title="总销售额" :value="revenueValue" /></div>
        <hr class="line">
        <div style="display: flex;justify-content: space-between;"><h4>已支付订单</h4><h4>{{ finshedOrder+pendingOrder }}</h4></div>
      </div>
    </el-col>
    <el-col :span="6">
    <div class="card"  style="height: 220px;">
      <div style="display: flex;justify-content:center;"><el-statistic title="总商品量" :value="goodsValue" /></div>
        <hr class="line">
        <div style="display: flex;justify-content: space-between;"><h4>商品类型种类</h4><h4>{{ goodsCategoryData.length }}</h4></div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="40">
    <el-col :span="12">
      <div class="card chart-center" style="height: 420px;margin-top: 20px;" ref="chartRef2"> </div>
    </el-col>
    <el-col :span="3">
      <div class="card" style="height: 100px;justify-content: center;display: flex;align-items: center;margin-top: 20px;"><button class="btn" @click="UserManage"><el-icon style="font-size: 40px;margin-top: 20px;"><Avatar /></el-icon><h4>用户管理 </h4></button>
      </div>
    </el-col>
    <el-col :span="3">
        <div class="card" style="height: 100px;justify-content: center;display: flex;align-items: center;margin-top: 20px;"><button class="btn" @click="GoodsManage"><el-icon style="font-size: 40px;margin-top: 20px;"><Sell /></el-icon><h4>商品管理 </h4></button>
      </div>
    </el-col>
    <el-col :span="3">
        <div class="card" style="height: 100px;justify-content: center;display: flex;align-items: center;margin-top: 20px;"><button class="btn" @click="OrderManage"><el-icon style="font-size: 40px;margin-top: 20px;"><ShoppingCart /></el-icon><h4>订单管理 </h4></button>
      </div>
    </el-col>
    <el-col :span="3">
        <div class="card" style="height: 100px;justify-content: center;display: flex;align-items: center;margin-top: 20px;"><button class="btn" @click="AftersaleManage"><el-icon style="font-size: 40px;margin-top: 20px;"><Comment /></el-icon><h4>售后管理 </h4></button>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="40">
    <el-col :span="24">
      <div class="card chart-center"  style="height: 235px; margin-top: -300px;margin-left: 51.5%;" ref="chartRef"></div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup name="home">
    //JS
import {ref,onMounted} from 'vue'
import router from '@/router/index'
import {Avatar,Sell,ShoppingCart,Comment} from '@element-plus/icons-vue'
import {get} from '@/utils/request';
import type { ChartData } from '@/types';
import { useTransition } from '@vueuse/core'
import { RetrieveData } from '@/utils/crud';
    //ECharts
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart,LineChart,PieChart } from 'echarts/charts';
import { UniversalTransition,LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type {User,Goods} from '@/types'
import { getUserData } from '@/api/user';
import { getGoodsData } from '@/api/goods';
import { getOrderData } from '@/api/order';

const props = defineProps({
  defaultActive: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:default-active'])

function UserManage(){
  emit('update:default-active', '2-2')
  router.push('../userManage')
}
function GoodsManage(){
  emit('update:default-active', '3-1')
  router.push('../goodsManage')
}
function OrderManage(){
  emit('update:default-active', '4-1')
  router.push('../orderManage')
}
function AftersaleManage(){
  emit('update:default-active', '5-1')
  router.push('../aftersaleManage')
}



//echart
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  LineChart,
  UniversalTransition,
  PieChart,
  LabelLayout
]);
const chartRef = ref(null)
const chartRef2 = ref(null)

//获取数据
const totalUsers = ref(0)
const userData =  ref<User[]>([])
const pageNum = ref(1)
const pageSize = ref(9999)
const mode1 = ref(3)
const total = ref(1)
const GetUserData = async ()=>{
  await RetrieveData(
    getUserData,
    userData,
    pageNum,
    pageSize,
    mode1,
    total
  )
  totalUsers.value = userData.value.length
}
const goodsData = ref<Goods[]>([])
const totalGoods = ref(0)
const mode2 = ref(0)
const GetGoodsData = async ()=>{
  await RetrieveData(
    getGoodsData,
    goodsData,
    pageNum,
    pageSize,
    mode2,
    total
  )
  totalGoods.value = goodsData.value.length
}
const orderData = ref<Goods[]>([])
const finshedOrderData = ref<Goods[]>([])
const pendingOrderData = ref<Goods[]>([])
const totalOrder = ref(0)
const finshedOrder = ref(0)
const pendingOrder = ref(0)
const transform = ref(0)
const mode3 = ref(5)
const mode4 = ref(4)
const GetOrderData = async ()=>{
  await RetrieveData(
    getOrderData,
    orderData,
    pageNum,
    pageSize,
    mode2,
    total
  )
  await RetrieveData(
  getOrderData,
  finshedOrderData,
  pageNum,
  pageSize,
  mode3,
  total
  )
  await RetrieveData(
  getOrderData,
  pendingOrderData,
  pageNum,
  pageSize,
  mode4,
  total
  )
  totalOrder.value = orderData.value.length
  finshedOrder.value = finshedOrderData.value.length
  pendingOrder.value = pendingOrderData.value.length
  transform.value = (finshedOrder.value/totalOrder.value)*100
}



onMounted( async ()=>{
  //柱状图
  const myChart = echarts.init(chartRef.value);
  const myChart2 = echarts.init(chartRef2.value)
  await GetOrderCategory()
  await GetGoodsCategory()
  await GetUserData()
  await GetGoodsData()
  await GetOrderData()
  await GetRevenue()
  myChart.setOption ( {
  title: {
    text: '订单统计'
  },
  tooltip: {},
  legend: {
    data: ['订单量']
  },
  xAxis: {
    data: orderCategoryData.value
  },
  yAxis: {
    type:'value'
  },
  series: [
    {
      name: '订单量',
      type: 'bar',
      data: orderCategoryData.value
    }]
  })
  //饼图
  myChart2.setOption({
  title: {
    top: '0%',
    text: '商品分类统计'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '商品统计',
      type: 'pie',
      radius: '50%',
      data: goodsCategoryData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })
})


const orderCategoryData = ref<ChartData[]>([])
const goodsCategoryData = ref<ChartData[]>([])
const GetOrderCategory = async ()=>{
  const res = await get('order/getCategory')
  orderCategoryData.value = res.data
}
const GetGoodsCategory = async ()=>{
  const res = await get('/category/getCategoryNameCount')
  goodsCategoryData.value = res.data
}
const totalRevenue = ref(0)
const GetRevenue = async ()=>{
  const res = await get('/order_item/getRevenue')
  totalRevenue.value = res.data
}
const userValue = useTransition(totalUsers, {
  duration: 1500,
})
const goodsValue = useTransition(totalGoods, {
  duration: 1500,
})
const orderValue = useTransition(totalOrder, {
  duration: 1500,
})
const revenueValue = useTransition(totalRevenue, {
  duration: 1500,
})
</script>

<style scoped>
    /* CSS */
    .card{
        background-color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        margin-bottom: 20px;
        flex-direction: column;
        justify-content: center;
        display: flex;
        padding: 20px;
    }
    .card:hover{
      transform: scale(1.05);
      transition: all 0.5s ease;
    }
    .line{
      width: 100%;
      color: rgb(197, 197, 197);
      margin-top: 20px;
    }
     .chart-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn{
      background-color: rgba(255, 255, 255, 0);
      border: 0;
    }
    .btn:hover{
      cursor: pointer;
      transform: scale(1.1);
      transition: all 0.3s ease;
    }
    .btn:active{
      transform: scale(0.9);
      transition: all 0.3s ease;
    }
    :deep(.el-statistic) {
  --el-statistic-title-font-size: 20px;
  --el-statistic-content-font-size: 40px;
}
</style>