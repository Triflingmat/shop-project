import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'

/**
 * @param {Function} apiFunc 接口请求方法
 * @param {<T=any>(Object)} data 要提交的数据
 * @param {Function} onCancel 重置表单方法
 * @param {Function} onSuccess 刷新列表方法
 * @param {Ref<boolean>} dialogVisible 弹窗显示状态
 * 以下为分页检索特有
 * @param {Ref{number}} pageNum 页数
 * @param {Ref{number}} pageSize 页大小
 * @param {Ref{number}} mode 检索模式
 * @param {Ref{number}} total 总页数
 */


//Create
export const CreateData = async (
    apiFunc:Function,
    data:any,
    onCancel:Function,
    onSuccess:Function,
    dialogVisible:Ref<Boolean>
)=>{
    dialogVisible.value = false
    let res = await apiFunc(data)
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
    onCancel()
    onSuccess()
}


//Retrieve
export const RetrieveData = async(
    apiFunc:Function,
    data:any,
    pageNum:Ref<number>,
    pageSize:Ref<number>,
    mode:Ref<number>,
    total:Ref<number>
)=>{
    let res = await apiFunc(pageNum.value,pageSize.value,mode.value)
  if(!res){
  alert("未连接至服务器！");
  }
  if(res.code === 200){
    ElMessage({
      message: '成功获取！',
      type: 'success',
      duration:1000
    })
    data.value = res.data.list
    total.value = res.data.total
    const totalPage = Math.ceil(total.value / pageSize.value)//更新页数
    //无数据时
    if (totalPage === 0) {
          pageNum.value = 1;
          return;
        }
    //有数据再更新
    if (pageNum.value > totalPage) {
      pageNum.value = totalPage
      await RetrieveData(
        apiFunc,
        data,
        pageNum,
        pageSize,
        mode,
        total
      )
    }
  }else{
        ElMessage.error("发生错误！")
  }
}


//Update
export const UpdateData = async (
    apiFunc:Function,
    data:any,
    onSuccess:Function,
    dialogVisible:Ref<Boolean>
)=>{
    dialogVisible.value = false
    let res = await apiFunc(data)
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
    onSuccess()
}


//Delete
export const DeleteData = async (
    apiFunc:Function,
    data:any,
    onSuccess:Function,
    dialogVisible:Ref<Boolean>
)=>{
    dialogVisible.value = false
    let res = await apiFunc(data.id)
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
    onSuccess()
}
