<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a>商品分类</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
  
  <div style="display: flex;flex-direction: row;margin: 20px;">
    <el-button type="primary" @click="dialogCreateVisible = true">
      <el-icon style="font-size: 20px;"><CirclePlus /></el-icon>
    </el-button>
  </div>

  <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="分类名称" prop="name" />
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">
          修改
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDel(scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="page">   
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      size="default"
      layout="prev, pager, next, jumper"
      @size-change="GetCategoryData"
      @current-change="GetCategoryData"
      :total="total"
    />
  </div>

  <!-- 修改分类弹窗 -->
  <el-dialog v-model="dialogUpdateVisible" title="修改分类" width="500">
    <el-form :model="editRowData">
      <el-form-item label="ID:">
        <el-input v-model="editRowData.id" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="分类名称：">
        <el-input v-model="editRowData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取消</el-button>
        <el-button type="primary"  @click="UpdateCategoryData(editRowData)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加分类弹窗 -->
  <el-dialog v-model="dialogCreateVisible" title="添加分类" width="500">
    <el-form :model="newCategoryData">
      <el-form-item label="分类名称：">
        <el-input v-model="newCategoryData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CreateCancel">取消</el-button>
        <el-button type="primary"  @click="CreateCategoryData">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除分类弹窗 -->
  <el-dialog v-model="dialogDeleteVisible" title="删除分类" width="500">
    <el-form-item label="确定要删除该分类？"></el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button type="primary"  @click="DeleteCategoryData(editRowData)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="CategoryManage">
import { onMounted, ref } from 'vue'
import { getCategoryList, postCategoryData, putCategoryData, delCategoryData } from '@/api/category'
import type { Category } from '@/types'
import { ElMessage } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'

//暂时存储本行数据
const editRowData = ref<Category>({} as Category)

    //删除数据
    const dialogDeleteVisible = ref(false)
    const handleDel = (row: Category)=>{
        editRowData.value = row
        dialogDeleteVisible.value = true;
}
const DeleteCategoryData = async (category: Category)=>{
  dialogDeleteVisible.value = false
  let res = await delCategoryData(category.id);
  console.log(res)
  if(!res){
    alert("未连接至服务器！");
  }  
  if(res.code === 200){
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
  }else{
        ElMessage.error("发生错误！")
      }
  GetCategoryData()
}


//增加数据
const dialogCreateVisible = ref(false)
const newCategoryData = ref<Category>({
    id:0,
    name:'',
})
const CreateCancel = ()=>{
  dialogCreateVisible.value = false
  newCategoryData.value.name=''
}
const CreateCategoryData = async ()=>{
  dialogCreateVisible.value = false
  let res = await postCategoryData(newCategoryData.value)
  if(!res){
    alert("未连接至服务器！");
  }  
  if(res.code === 200){
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
  }else{
        ElMessage.error("发生错误！")
      }
  CreateCancel()
  GetCategoryData()
}

//更改数据
const dialogUpdateVisible = ref(false)
const handleEdit = (row: Category)=>{
  editRowData.value = row;
  dialogUpdateVisible.value = true
}
const UpdateCategoryData = async (category: Category)=>{
  dialogUpdateVisible.value = false
  let res = await putCategoryData(category)
  if(!res){
  alert("未连接至服务器！");
  }
  if(res.code === 200){
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
  }else{
        ElMessage.error("发生错误！")
      }
  GetCategoryData()
}

//获取数据
const tableData = ref<Category[]>([])
const pageNum = ref(1)
const pageSize = ref(15)
const total = ref(1)

 const GetCategoryData = async () => {
  let res = await getCategoryList(pageNum.value,pageSize.value)
  console.log(res)
  if(!res){
  alert("未连接至服务器！");
  }
  if(res.code === 200){
    ElMessage({
      message: '成功获取分类列表！',
      type: 'success',
    })
    tableData.value = res.data.list
    total.value = res.data.total
    const totalPage = Math.ceil(total.value / pageSize.value)//更新页数
    if (pageNum.value > totalPage) {
      pageNum.value = totalPage
      await GetCategoryData()
    }
  }else{
        ElMessage.error("发生错误！")
  }
}

  
onMounted(()=>{
  GetCategoryData()
}
)
</script>

<style scoped>
    /* CSS */

</style>