<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a>管理员管理</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <el-table :data="filterTableData" style="width: 100%;margin-top: 20px;">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="Name" prop="username" />
    <el-table-column label="Power" prop="power" />
    <el-table-column align="right">
      <template #header>
        <div style="display: flex;flex-direction: row;">
          <el-input v-model="search" size="small" placeholder="搜索用户名" />
          <el-button type="primary" style="margin-left: 20px;" @click="dialogCreateVisible = true"><el-icon style="font-size: 20px;"><CirclePlus /></el-icon></el-button>
        </div>

      </template>
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
      @size-change="GetUserData"
      @current-change="GetUserData"
      :total="total"
    />
  </div>
  
  <!--修改按钮弹窗-->
  <el-dialog v-model="dialogUpdateVisible" title="修改管理员" width="500">
    <el-form :model="editRowData" :rules="updateRules" ref="updateForm">
      <el-form-item label="ID:">
        <el-input v-model="editRowData.id" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="editRowData.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="editRowData.password" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="权限：" prop="power">
        <el-select v-model="editRowData.power" placeholder="请选择权限">
          <el-option label="2(管理员权限)" value="2" />
          <el-option label="3(用户权限)" value="3" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取消</el-button>
        <el-button type="primary"  @click="UpdateUserData(editRowData)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!--添加按钮弹窗-->
    <el-dialog v-model="dialogCreateVisible" title="添加管理员" width="500">
    <el-form :model="newUserData" :rules="createRules" ref="createForm">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="newUserData.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="newUserData.password" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="权限：" prop="power">
        <el-select v-model="newUserData.power" placeholder="请选择权限">
          <el-option label="2(管理员权限)" value="2" />
          <el-option label="3(用户权限)" value="3" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CreateCancel">取消</el-button>
        <el-button type="primary"  @click="CreateUserData">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

    <!--删除按钮弹窗-->
  <el-dialog v-model="dialogDeleteVisible" title="删除管理员" width="500">
    <el-form-item label="确定要删除该管理员？"></el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button type="primary"  @click="DeleteUserData(editRowData)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="AdminManage">
import { computed, onMounted, ref } from 'vue'
import {getUserData,postUserData,putUserData,delUserData} from '@/api/user'
import type {User} from '@/types'
import {CirclePlus} from '@element-plus/icons-vue'
import { CreateData,RetrieveData,UpdateData,DeleteData } from '@/utils/crud'

// 表单引用
const updateForm = ref()
const createForm = ref()

// 表单校验规则
const updateRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  power: [
    { required: true, message: '请选择权限', trigger: 'change' }
  ]
}

const createRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  power: [
    { required: true, message: '请选择权限', trigger: 'change' }
  ]
}

//暂时存储本行数据
const editRowData = ref<User>({} as User)

//删除数据
const dialogDeleteVisible = ref(false)
const handleDel = (row:User)=>{
  editRowData.value = row
  dialogDeleteVisible.value = true;
}
const DeleteUserData = async (user:User)=>{
  DeleteData(
    delUserData,
    user,
    GetUserData,
    dialogDeleteVisible
  )
}


//增加数据
const dialogCreateVisible = ref(false)
const newUserData = ref<User>({
  id:0,
  username:'',
  password:'',
  power:2,
  phone:'',
  address:'',
  salt:''
})
const CreateCancel = ()=>{
  dialogCreateVisible.value = false
  newUserData.value.username=''
  newUserData.value.password=''
  newUserData.value.power=2
}
const CreateUserData = async ()=>{
  if (!createForm.value) return
  
  createForm.value.validate(async (valid: boolean) => {
    if (valid) {
      CreateData(
        postUserData,
        newUserData.value,
        CreateCancel,
        GetUserData,
        dialogCreateVisible
      )
    }
  })
}

//更改数据
const dialogUpdateVisible = ref(false)
const handleEdit = (row:User)=>{
  editRowData.value = row;
  dialogUpdateVisible.value = true
}
const UpdateUserData = async (user:User)=>{
  if (!updateForm.value) return
  
  updateForm.value.validate(async (valid: boolean) => {
    if (valid) {
      UpdateData(
        putUserData,
        user,
        GetUserData,
        dialogUpdateVisible
      )
    }
  })
}

//获取数据
const search = ref('')
const tableData = ref<User[]>([])
const pageNum = ref(1)
const pageSize = ref(15)
const total = ref(1)
const mode = ref(2)
const GetUserData = async () => {
  RetrieveData(
    getUserData,
    tableData,
    pageNum,
    pageSize,
    mode,
    total
  )
}
const filterTableData = computed(() =>
  tableData.value.filter(
    (data:User) =>
      (!search.value ||
      data.username.toLowerCase().includes(search.value.toLowerCase()))
  )
)
  
onMounted(()=>{
  GetUserData()
}
)

</script>

<style>
  .page{
    display: flex;
    justify-content: center;
    margin: 30px;
  }
</style>