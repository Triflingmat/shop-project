<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a>用户管理</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <el-table :data="filterTableData" style="width: 100%;margin-top: 20px;">
    <el-table-column label="ID" prop="id" />
    <el-table-column label="Name" prop="username" />
    <el-table-column label="Phone" prop="phone" />
    <el-table-column label="Address" prop="address" />
    <el-table-column align="right">
      <template #header>
        <div style="display: flex;flex-direction: row;">
          <el-input v-model="search" size="small" placeholder="搜索用户名"  />
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
  <el-dialog v-model="dialogUpdateVisible" title="修改用户" width="500">
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
          <el-option label="2(管理员权限)" value="2" :disabled="userStore.power === 2" />
          <el-option label="3(用户权限)" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话号:" prop="phone">
        <el-input v-model="editRowData.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="editRowData.address" autocomplete="off" />
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
    <el-dialog v-model="dialogCreateVisible" title="添加用户" width="500">
    <el-form :model="newUserData" :rules="createRules" ref="createForm">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="newUserData.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="newUserData.password" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="权限：" prop="power">
        <el-select v-model="newUserData.power" placeholder="请选择权限">
          <el-option label="2(管理员权限)" value="2" :disabled="userStore.power === 2" />
          <el-option label="3(用户权限)" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话号:" prop="phone">
        <el-input v-model="newUserData.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="newUserData.address" autocomplete="off" />
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
  <el-dialog v-model="dialogDeleteVisible" title="删除用户" width="500">
    <el-form-item label="确定要删除该用户？"></el-form-item>
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


<script lang="ts" setup name="UserManage">
import { computed, onMounted, ref } from 'vue'
import {getUserData,postUserData,putUserData,delUserData} from '@/api/user'
import type {User} from '@/types'
import { ElMessage } from 'element-plus'
import {CirclePlus} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

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
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 5, message: '地址长度至少5个字符', trigger: 'blur' }
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
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 5, message: '地址长度至少5个字符', trigger: 'blur' }
  ]
}

//暂时存储本行数据
const editRowData = ref<User>({} as User)

const userStore = useUserStore()

//删除数据
const dialogDeleteVisible = ref(false)
const handleDel = (row:User)=>{
  editRowData.value = row
  dialogDeleteVisible.value = true;
}
const DeleteUserData = async (user:User)=>{
  dialogDeleteVisible.value = false
  let res = await delUserData(user.id);
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
  GetUserData()
}


//增加数据
const dialogCreateVisible = ref(false)
const newUserData = ref<User>({
  id:0,
  username:'',
  password:'',
  power:3,
  phone:'',
  address:'',
  salt:''
})
const CreateCancel = ()=>{
  dialogCreateVisible.value = false
  newUserData.value.username=''
  newUserData.value.password=''
  newUserData.value.power=3
}
const CreateUserData = async ()=>{
  if (!createForm.value) return
  
  createForm.value.validate(async (valid: boolean) => {
    if (valid) {
      dialogCreateVisible.value = false
      let res = await postUserData(newUserData.value)
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
      GetUserData()
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
      dialogUpdateVisible.value = false
      let res = await putUserData(user)
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
    }
  })
}

//获取数据
const search = ref('')
const tableData = ref<User[]>([])
const pageNum = ref(1)
const pageSize = ref(15)
const total = ref(1)
const GetUserData = async () => {
  let res = await getUserData(pageNum.value,pageSize.value,3)
  console.log(res)
  if(!res){
  alert("未连接至服务器！");
  }
  if(res.code === 200){
    ElMessage({
      message: '成功获取用户列表！',
      type: 'success',
    })
    tableData.value = res.data.list
    total.value = res.data.total
    const totalPage = Math.ceil(total.value / pageSize.value)//更新页数
    if (pageNum.value > totalPage) {
      pageNum.value = totalPage
      await GetUserData()
    }
  }else{
        ElMessage.error("发生错误！")
  }
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

</style>