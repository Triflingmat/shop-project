<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a>售后问题</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <div style="display: flex;flex-direction: row;margin: 20px;">
    <el-input v-model="search" size="small" placeholder="搜索订单号" style="width: 25%;"  @keyup.enter="handleSearch" />
      <el-select v-model="searchType" placeholder="搜索类型" style="width: 240px;margin-left: 20px;" @change="handleSearch" >
        <el-option label="全部类型" value="0"/>
        <el-option label="退款" value="1"/>
        <el-option label="退货退款" value="2"/>
      </el-select>
      <el-select v-model="searchStatus" placeholder="搜索状态" style="width: 240px;margin-left: 20px;" @change="handleSearch" >
        <el-option label="全部状态" value="0"/>
        <el-option label="待审核" value="1"/>
        <el-option label="已通过" value="2"/>
        <el-option label="未通过" value="3"/>
        <el-option label="已完成" value="4"/>
      </el-select>
  </div>
  <el-table :data="filterTableData" style="width: 100%;margin-top: 20px;">
    <el-table-column label="订单号" prop="order_id" />
    <el-table-column label="类型" prop="type" >
      <template #default="scope">
            <span>{{typeMap[scope.row.type] || '未知类型' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="status">
      <template #default="scope">
            <span>{{statusMap[scope.row.status] || '未知状态' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="理由" prop="reason"/>
    <el-table-column label="时间" prop="creat_time"/>
    <el-table-column align="right">
      <template #default="scope">
        <el-popconfirm
          confirm-button-text="Yes"
          cancel-button-text="No"
          title="是否通过审核？"
          @confirm="checkConfirm(scope.row)"
          @cancel="scope.row.status = 3"
        >
          <template #reference>
        <el-button size="small" type="primary" :disabled="scope.row.status !== 1">
          审核
        </el-button>
      </template>
        </el-popconfirm>
        <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
        <el-button size="small" @click="handleRemark(scope.row)" color="#333333">备注</el-button>
      </template>
    </el-table-column>
  </el-table>

    <el-dialog v-model="dialogDetailVisible" title="售后详情" width="500">
    <el-form :model="editRowData">
      <el-form-item label="ID:">{{ editRowData.id }}</el-form-item>
      <el-form-item label="订单ID">{{ editRowData.order_id }}</el-form-item>
      <el-form-item label="商品名称：">{{ editRowData.goods_name }}</el-form-item>
      <el-form-item label="退款金额：">{{ editRowData.refund_price }}</el-form-item>
      <el-form-item label="退款理由：">{{ editRowData.reason }}</el-form-item>
      <el-form-item label="退款类型：">{{ editRowData.type }}</el-form-item>
      <el-form-item label="退款状态：">{{ editRowData.status }}</el-form-item>
      <el-form-item label="备注：">{{ editRowData.admin_note }}</el-form-item>
      <el-form-item label="创建时间：">{{ editRowData.creat_time }}</el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">确认</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<script lang="ts" setup name="AftersaleManage">
    //JS
import {ref,onMounted,computed} from 'vue'
import type { afterSales } from '@/types'
import {getAfterSalesList,putAfterSalesData} from '@/api/aftersale'
import { ElMessage,ElMessageBox } from 'element-plus'

const typeMap: Record<number,string> = {
  1:'退款',
  2:'退货退款'
}
const statusMap: Record<number,string> = {
  1:'待审核',
  2:'已通过',
  3:'未通过',
  4:'已完成'  
}

const handleSearch = ()=>{
  pageNum.value = 1
  GetAfterSalesData()
}

const dialogDetailVisible = ref(false)
const handleDetail = (row:afterSales)=>{
  editRowData.value = row
  dialogDetailVisible.value = true
}
const handleRemark = (row:afterSales)=>{
  ElMessageBox.prompt('请输入备注', '备注', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: row.admin_note,
  })
    .then(({ value }) => {
      row.admin_note = value
      editRowData.value=row
      UpdateAfterSalesData()
      ElMessage({
        type: 'success',
        message: `成功备注`,
      })

    })
}


//查询
const pageNum = ref(1)
const pageSize = ref(15)
const total = ref(1)

const search = ref('')
const searchType=ref<number|null>(null)
const searchStatus=ref<number|null>(null)
const tableData = ref<afterSales[]>([])

const GetAfterSalesData = async ()=>{
  let res = await getAfterSalesList(pageNum.value,pageSize.value,searchType.value,searchStatus.value)
  console.log(res)
    if (!res) {
    alert("未连接至服务器！")
    return
  }
  if (res.code === 200) {
     ElMessage({
       message: '成功获取列表！',
       type: 'success',
     })
    tableData.value = res.data.list
    total.value = res.data.total

    const totalPage = Math.ceil(total.value / pageSize.value)

    if (totalPage > 0 && pageNum.value > totalPage) {
      pageNum.value = totalPage
      await GetAfterSalesData()
    }

    if (totalPage === 0) {
      pageNum.value = 1
    }
  } else {
    ElMessage.error("发生错误！")
  }
}

const filterTableData = computed(() =>
  tableData.value.filter((data) => {
    if (!search) return true;
    
    return data.order_id.toString().includes(search.value.trim());
  })
);


const editRowData = ref<afterSales>({} as afterSales)
const UpdateAfterSalesData = async ()=>{
  let res = await putAfterSalesData(editRowData.value)
  if(!res){
    alert("未连接至服务器！")
    return
  }
  if (res.code === 200) {
     ElMessage({
       message: '成功更新列表！',
       type: 'success',
     })
  }else{
        ElMessage.error('更新失败！')
  }
  GetAfterSalesData()
}

const checkConfirm = (row:afterSales)=>{
  row.status = 2
  editRowData.value = row
  UpdateAfterSalesData()
}

onMounted(()=>{
  GetAfterSalesData()
})
</script>

<style>
    /* CSS */

</style>