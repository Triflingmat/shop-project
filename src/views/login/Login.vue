<template>
    <!--    html    -->
    <div class="center">
        <div class="login-box">
            <div style="width: 50%;">
                <img src="/src/assets/LoginPic.jpg" width="100%">
            </div>
            <div class="text-center">
                <h1>商品后台管理系统</h1>
                <div class="input-item">
                    <el-icon><User/></el-icon>
                    <el-input v-model="userdata.username" placeholder="请输入账号"></el-input>
                </div>
                <div>
                    <div class="input-item"><el-icon><Lock/></el-icon>
                    <el-input v-model="userdata.password" type="password" placeholder="请输入密码"></el-input></div>
                    <div v-if="isError" class="error-msg Error-tips">{{ errorMsg }}</div>
                </div>
                <el-button class="btn" @click="Login">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="Login">
    //JS
    import {User,Lock} from '@element-plus/icons-vue'
    import router  from '@/router/index'
    import {ref} from 'vue'
    import { login } from '@/api/login'
    import { useUserStore } from '@/stores/user'
import { ca } from 'element-plus/es/locale/index.mjs'

    const userdata = ref(
        {
            username:'',
            password:'',
        }
    )
    const errorMsg = ref('')
    const isError = ref(false)
    const userStore = useUserStore()

    async function Login(){
        try{
            const {userData,token} = await login(userdata.value.username,userdata.value.password);
            userStore.login(userData,token)
            router.push('/home')
        }catch(error){
            console.log(error)
        }
    }
</script>

<style scoped>
    /* CSS */
    .login-box{
        display: flex;
        flex-direction: row;
        width: 1000px;
        height: 600px;
        background: rgb(255,255,255,0.3);
        box-shadow: 0 0 10px;        
    }
    a{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .center{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        background: #f0f2f5;
    }
    .text-center{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50%;
        height: 100%;
    }
    .text-center a{
        padding: 0 60px;
        box-sizing: border-box;
    }

    .input-item{
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 60px;
        box-sizing: border-box;
        margin-top: 30px;
        width: 500px;
    }

    .input-item .el-icon{
        margin-right: 10px;
        font-size: 18px;
    }
    .input-item .el-input{
        flex: 1;
    }
    h1 {
        margin-bottom: 50px;
    }
    .btn{
        width: 300px;
        background: black;
        color: white;
        margin-top: 30px;
    }
    .btn:hover{
        background-color: white;
        color: black;
    }
    :deep(.el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px black !important;
    }
    .Error-tips{
        font-size: 15px;
        color: red;
    }
    .error-msg{
        margin-left: 100px;
    }
</style>