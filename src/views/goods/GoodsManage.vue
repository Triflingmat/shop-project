<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a>商品属性</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <div style="display: flex;flex-direction: row;margin: 20px;">
    <el-input v-model="search" size="small" placeholder="搜索商品名" style="width: 25%;"  @keyup.enter="handleSearch" />
      <el-select v-model="searchCategoryId" placeholder="Select" style="width: 240px;margin-left: 20px;" @change="handleSearch" >
      <el-option label="全部分类" :value="0" />
      <el-option
        v-for="item in categoryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <el-button type="primary" style="margin-left: 20px;" @click="dialogCreateVisible = true"><el-icon style="font-size: 20px;"><CirclePlus /></el-icon></el-button>
  </div>
  <el-table :data="filterTableData" style="width: 100%;margin-top: 20px;"  :row-class-name="tableRowClassName">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="商品图片">
        <template #default="scope">
            <el-image 
                style="width: 80px; height: 80px" 
                :src="scope.row.goods_img" 
                preview-teleported
                :preview-src-list="[scope.row.goods_img]"
                />
        </template>
    </el-table-column>
    <el-table-column label="商品名称" prop="name" />
    <el-table-column label="价格" prop="price" />
    <el-table-column label="库存" prop="stock" />
    <el-table-column label="是否上架" prop="is_on_sale" >
        <template #default="scope">
            <span>{{ scope.row.is_on_sale === 1 ? '是' : '否' }}</span>
        </template>
    </el-table-column>
    <el-table-column label="描述" prop="goods_desc" show-overflow-tooltip="true" />
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
      @size-change="GetGoodsData"
      @current-change="GetGoodsData"
      :total="total"
    />
  </div>
  
  <!--修改按钮弹窗-->
  <el-dialog v-model="dialogUpdateVisible" title="修改商品" width="500">
    <el-form :model="editRowData" :rules="updateRules" ref="updateForm">
      <el-form-item label="ID:">
        <el-input v-model="editRowData.id" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="商品图片URL:" prop="goods_img">
        <el-input v-model="editRowData.goods_img" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="editRowData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格：" prop="price">
        <el-input v-model="editRowData.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否上架：">
        <el-switch
            v-model="editRowData.is_on_sale"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
        />
      </el-form-item>
      <el-form-item label="商品分类：" prop="category_id">
           <el-select v-model="editRowData.category_id" placeholder="请选择分类" >
            <el-option label="全部分类" :value="0" />
    <el-option
      v-for="item in categoryList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
      </el-form-item>
      <el-form-item label="商品库存：" prop="stock">
        <el-input v-model="editRowData.stock" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品描述：" prop="goods_desc">
        <el-input v-model="editRowData.goods_desc" autocomplete="off" />
      </el-form-item>
      </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取消</el-button>
        <el-button type="primary"  @click="UpdateGoodsData(editRowData)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!--添加按钮弹窗-->
    <el-dialog v-model="dialogCreateVisible" title="添加商品" width="500">
    <el-form :model="newGoodsData" :rules="createRules" ref="createForm">
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="newGoodsData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品图片URL:" prop="goods_img">
        <el-input v-model="newGoodsData.goods_img" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格：" prop="price">
        <el-input v-model="newGoodsData.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否上架：">
        <el-switch
            v-model="newGoodsData.is_on_sale"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
        />
      </el-form-item>
      <el-form-item label="商品分类：" prop="category_id">
           <el-select v-model="newGoodsData.category_id" placeholder="请选择分类" >
            <el-option label="全部分类" :value="0" />
    <el-option
      v-for="item in categoryList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
      </el-form-item>
      <el-form-item label="商品库存：" prop="stock">
        <el-input v-model="newGoodsData.stock" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品描述：" prop="goods_desc">
        <el-input v-model="newGoodsData.goods_desc" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CreateCancel">取消</el-button>
        <el-button type="primary"  @click="CreateGoodsData">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

    <!--删除按钮弹窗-->
  <el-dialog v-model="dialogDeleteVisible" title="删除商品" width="500">
    <el-form-item label="确定要删除该商品？"></el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button type="primary"  @click="DeleteGoodsData(editRowData)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="GoodsManage">
    //JS
import { onMounted, ref,computed } from 'vue'
import {getGoodsData,postGoodsData,putGoodsData,delGoodsData} from '@/api/goods'
import type {Goods,Category, afterSales} from '@/types'
import { ElMessage } from 'element-plus'
import {CirclePlus} from '@element-plus/icons-vue'
import {getCategoryList} from '@/api/category'

// 表单引用
const updateForm = ref()
const createForm = ref()

// 表单校验规则
const updateRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  goods_img: [
    { required: true, message: '请输入商品图片URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
    { min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择商品分类', trigger: 'change' },
    { min: 1, message: '请选择有效的分类', trigger: 'change' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
    { min: 0, message: '库存不能为负数', trigger: 'blur' }
  ],
  goods_desc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 5, message: '商品描述长度至少5个字符', trigger: 'blur' }
  ]
}

const createRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  goods_img: [
    { required: true, message: '请输入商品图片URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
    { min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择商品分类', trigger: 'change' },
    { min: 1, message: '请选择有效的分类', trigger: 'change' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
    { min: 0, message: '库存不能为负数', trigger: 'blur' }
  ],
  goods_desc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 5, message: '商品描述长度至少5个字符', trigger: 'blur' }
  ]
}

//暂时存储本行数据
const editRowData = ref<Goods>({} as Goods)

const tableRowClassName = ({ row }: { row: Goods }) => {
  if (row.is_on_sale === 0) {
    return 'warning-row'
  }
  return ''
}
//分类筛选
const categoryList = ref<Category[]>([])
const searchCategoryId = ref(0)

//删除数据
const dialogDeleteVisible = ref(false)
const handleDel = (row:Goods)=>{
  editRowData.value = row
  dialogDeleteVisible.value = true;
}
const DeleteGoodsData = async (goods:Goods)=>{
  dialogDeleteVisible.value = false
  let res = await delGoodsData(goods.id);
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
  GetGoodsData()
}


//增加数据
const dialogCreateVisible = ref(false)
const newGoodsData = ref<Goods>({
    id:0,
    name:'',
    price:'',
    is_on_sale:1,
    goods_img:'',
    category_id:0,
    goods_desc:'',
    stock:0
})
const CreateCancel = ()=>{
  dialogCreateVisible.value = false
  newGoodsData.value.name=''
  newGoodsData.value.price=''
  newGoodsData.value.is_on_sale=1
  newGoodsData.value.goods_img=''
  newGoodsData.value.category_id=0
  newGoodsData.value.goods_desc=''
  newGoodsData.value.stock=0
}
const CreateGoodsData = async ()=>{
  if (!createForm.value) return
  
  createForm.value.validate(async (valid: boolean) => {
    if (valid) {
      dialogCreateVisible.value = false
      let res = await postGoodsData(newGoodsData.value)
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
      GetGoodsData()
    }
  })
}

//更改数据
const dialogUpdateVisible = ref(false)
const handleEdit = (row:Goods)=>{
  editRowData.value = row;
  dialogUpdateVisible.value = true
}
const UpdateGoodsData = async (goods:Goods)=>{
  if (!updateForm.value) return
  
  updateForm.value.validate(async (valid: boolean) => {
    if (valid) {
      dialogUpdateVisible.value = false
      let res = await putGoodsData(goods)
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
      GetGoodsData()
    }
  })
}

//获取数据
const search = ref('')
const tableData = ref<Goods[]>([])
const pageNum = ref(1)
const pageSize = ref(6)
const total = ref(1)
const GetGoodsData = async () => {
  let res = await getGoodsData(pageNum.value, pageSize.value, searchCategoryId.value)
  console.log(res)
  if (!res) {
    alert("未连接至服务器！")
    return
  }
  if (res.code === 200) {
     ElMessage({
       message: '成功获取商品列表！',
       type: 'success',
     })
    tableData.value = res.data.list
    total.value = res.data.total

    // 计算总页数
    const totalPage = Math.ceil(total.value / pageSize.value)

    //如果当前页 > 总页数> 0，跳转到最后一页
    if (totalPage > 0 && pageNum.value > totalPage) {
      pageNum.value = totalPage
      await GetGoodsData()
    }

    //如果没有数据，强制重置到第1页
    if (totalPage === 0) {
      pageNum.value = 1
    }
  } else {
    ElMessage.error("发生错误！")
  }
}
const handleSearch = () => {
  pageNum.value = 1  // 搜索从第一页开始
  GetGoodsData()
}

const filterTableData = computed(() =>
  tableData.value.filter((data) => {
    if (!search) return true;
    
    return data.name.toLowerCase().includes(search.value.toLowerCase());
  })
);



onMounted(()=>{
  GetGoodsData()

  getCategoryList(1,100).then(res => {
    if (res.code === 200) {
      categoryList.value = res.data.list
      console.log(res)
    }
  })
})

</script>

<style>
    /* CSS */
  .page{
    display: flex;
    justify-content: center;
    margin: 30px;
  }
  .el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>