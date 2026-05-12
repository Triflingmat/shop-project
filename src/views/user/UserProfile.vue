<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- 订单相关 ---
import { getMyOrderList, updateOrder, deleteOrder } from '@/api/order'
import OrderCard from '@/components/OrderCard.vue'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const orderTotal = ref(0)
const orderPage = ref(1)
const orderPageSize = 10
const orderMode = ref<number | undefined>(undefined)
const modeLabels: Record<number, string> = { 3: '待支付', 4: '待收货', 5: '已完成', 1: '已取消', 2: '已退款' }

// 订单 Tab 列表，保证"全部"在最前
const orderTabs = [
    { label: '全部', mode: undefined as number | undefined },
    ...Object.entries(modeLabels).map(([key, label]) => ({
        label,
        mode: Number(key),
    })),
]

const fetchOrders = async () => {
    try {
        const res = await getMyOrderList({ pageNum: orderPage.value, pageSize: orderPageSize, mode: orderMode.value })
        orders.value = res.list || []
        orderTotal.value = res.total
    } catch { /* ignore */ }
}

// --- 售后相关 ---
import { getMyAftersaleList } from '@/api/aftersale'
import type { AfterSales } from '@/types'

const aftersales = ref<AfterSales[]>([])
const afterTotal = ref(0)
const afterPage = ref(1)
const afterPageSize = 10
const typeMap: Record<number, string> = { 1: '仅退款', 2: '退货退款' }
const statusMap: Record<number, { label: string; type: string }> = {
    1: { label: '待审核', type: 'warning' },
    2: { label: '已通过', type: 'success' },
    3: { label: '已拒绝', type: 'danger' },
    4: { label: '已完成', type: 'info' },
}

const fetchAftersales = async () => {
    try {
        const res = await getMyAftersaleList({ pageNum: afterPage.value, pageSize: afterPageSize })
        aftersales.value = res.list || []
        afterTotal.value = res.total
    } catch { /* ignore */ }
}

// --- 标签页 ---
const activeTab = ref('profile')

onMounted(() => {
    fetchOrders()
    fetchAftersales()
})

// --- 个人信息 ---
const router = useRouter()
const userStore = useUserStore()
const user = userStore.userInfo

const editForm = reactive({ phone: user?.phone || '', address: user?.address || '' })
const saving = ref(false)

const saveProfile = async () => {
    saving.value = true
    try {
        await userStore.updateProfile(editForm)
        ElMessage.success('保存成功')
    } catch (e: any) {
        ElMessage.error(e.message || '保存失败')
    } finally {
        saving.value = false
    }
}

const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const changing = ref(false)

const changePassword = async () => {
    if (!pwdForm.oldPassword) return ElMessage.warning('请输入原密码')
    if (pwdForm.newPassword.length < 6) return ElMessage.warning('新密码至少6位')
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return ElMessage.warning('两次密码不一致')
    if (pwdForm.oldPassword !== user?.password) return ElMessage.warning('原密码错误')
    changing.value = true
    try {
        await userStore.updateProfile({ password: pwdForm.newPassword })
        ElMessage.success('密码修改成功，请重新登录')
        userStore.logout()
        router.push('/login')
    } catch (e: any) {
        ElMessage.error(e.message || '修改失败')
    } finally {
        changing.value = false
    }
}

const handleLogout = async () => {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    userStore.logout()
    ElMessage.success('已退出')
    router.push('/home')
}

// --- 订单操作 ---
const cancelOrder = async (order: Order) => {
    await ElMessageBox.confirm('确定取消该订单吗？', '提示', { type: 'warning' })
    try { await updateOrder({ id: order.id, state: 1 }); ElMessage.success('已取消'); fetchOrders() }
    catch (e: any) { ElMessage.error(e.message || '操作失败') }
}
const payOrder = async (order: Order) => {
    // 小项目直接模拟付款完成，状态从 3（待支付）→ 4（待收货）
    try { await updateOrder({ id: order.id, state: 4 }); ElMessage.success('付款成功'); fetchOrders() }
    catch (e: any) { ElMessage.error(e.message || '操作失败') }
}
const confirmReceive = async (order: Order) => {
    await ElMessageBox.confirm('确认已收到货吗？', '提示', { type: 'warning' })
    try { await updateOrder({ id: order.id, state: 5 }); ElMessage.success('已确认收货'); fetchOrders() }
    catch (e: any) { ElMessage.error(e.message || '操作失败') }
}
const removeOrder = async (id: number) => {
    await ElMessageBox.confirm('确定删除该订单吗？', '提示', { type: 'warning' })
    try { await deleteOrder(id); ElMessage.success('已删除'); fetchOrders() }
    catch (e: any) { ElMessage.error(e.message || '删除失败') }
}
</script>

<template>
    <div class="profile-page" v-if="user">
        <h2 class="page-title">个人中心</h2>
        <div class="profile-layout">
            <!-- 左侧菜单 -->
            <aside class="side-menu">
                <div :class="['menu-item', { active: activeTab === 'profile' }]" @click="activeTab = 'profile'">个人信息</div>
                <div :class="['menu-item', { active: activeTab === 'orders' }]" @click="activeTab = 'orders'">我的订单</div>
                <div :class="['menu-item', { active: activeTab === 'aftersales' }]" @click="activeTab = 'aftersales'">售后记录</div>
                <div class="menu-item danger" @click="handleLogout">退出登录</div>
            </aside>

            <!-- 右侧内容 -->
            <div class="main-content">
                <!-- 个人信息 -->
                <template v-if="activeTab === 'profile'">
                    <el-card class="section">
                        <template #header><span>基本信息</span></template>
                        <el-descriptions :column="1" border>
                            <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
                            <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                    <el-card class="section">
                        <template #header><span>编辑信息</span></template>
                        <el-form :model="editForm" label-width="80px">
                            <el-form-item label="手机号"><el-input v-model="editForm.phone" placeholder="请输入手机号" /></el-form-item>
                            <el-form-item label="收货地址"><el-input v-model="editForm.address" placeholder="请输入收货地址" /></el-form-item>
                            <el-form-item><el-button type="primary" :loading="saving" @click="saveProfile">保存</el-button></el-form-item>
                        </el-form>
                    </el-card>
                    <el-card class="section">
                        <template #header><span>修改密码</span></template>
                        <el-form :model="pwdForm" label-width="80px">
                            <el-form-item label="原密码"><el-input v-model="pwdForm.oldPassword" type="password" show-password /></el-form-item>
                            <el-form-item label="新密码"><el-input v-model="pwdForm.newPassword" type="password" show-password /></el-form-item>
                            <el-form-item label="确认密码"><el-input v-model="pwdForm.confirmPassword" type="password" show-password /></el-form-item>
                            <el-form-item><el-button type="warning" :loading="changing" @click="changePassword">修改密码</el-button></el-form-item>
                        </el-form>
                    </el-card>
                </template>

                <!-- 我的订单 -->
                <template v-if="activeTab === 'orders'">
                    <div class="tabs">
                        <span
                            v-for="tab in orderTabs"
                            :key="String(tab.mode)"
                            :class="{ active: orderMode === tab.mode }"
                            @click="orderMode = tab.mode; orderPage = 1; fetchOrders()"
                        >
                            {{ tab.label }}
                        </span>
                    </div>
                    <div v-if="orders.length === 0" class="empty">暂无订单</div>
                    <template v-else>
                        <div v-for="order in orders" :key="order.id" class="order-wrapper">
                            <OrderCard
                                :order="order"
                                @cancel="cancelOrder"
                                @pay="payOrder"
                                @confirm="confirmReceive"
                                @remove="removeOrder"
                                @aftersale="(orderId: number) => router.push(`/aftersale/apply/${orderId}`)"
                            />
                        </div>
                        <div class="pagination" v-if="orderTotal > orderPageSize">
                            <el-pagination background layout="prev, pager, next" :total="orderTotal" :page-size="orderPageSize" :current-page="orderPage" @current-change="(p: number) => { orderPage = p; fetchOrders() }" />
                        </div>
                    </template>
                </template>

                <!-- 售后记录 -->
                <template v-if="activeTab === 'aftersales'">
                    <div v-if="aftersales.length === 0" class="empty">暂无售后记录</div>
                    <template v-else>
                        <el-table :data="aftersales" style="width: 100%">
                            <el-table-column prop="id" label="编号" width="70" />
                            <el-table-column prop="order_id" label="订单号" width="90" />
                            <el-table-column prop="goods_name" label="商品" min-width="150" />
                            <el-table-column label="类型" width="100">
                                <template #default="{ row }">{{ typeMap[row.type] || '未知' }}</template>
                            </el-table-column>
                            <el-table-column label="退款金额" width="100">
                                <template #default="{ row }">¥{{ row.refund_price }}</template>
                            </el-table-column>
                            <el-table-column label="状态" width="90">
                                <template #default="{ row }">
                                    <el-tag :type="(statusMap[row.status]?.type || 'info') as any" size="small">
                                        {{ statusMap[row.status]?.label || '未知' }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="creat_time" label="申请时间" width="170" />
                            <el-table-column label="操作" width="80">
                                <template #default="{ row }">
                                    <el-button type="primary" link @click="router.push(`/aftersale/detail/${row.id}`)">详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination" v-if="afterTotal > afterPageSize">
                            <el-pagination background layout="prev, pager, next" :total="afterTotal" :page-size="afterPageSize" :current-page="afterPage" @current-change="(p: number) => { afterPage = p; fetchAftersales() }" />
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-title { font-size: 22px; margin-bottom: 20px; color: #333; }
.profile-layout { display: flex; gap: 20px; }
.side-menu { width: 180px; flex-shrink: 0; background: #fff; border-radius: 8px; overflow: hidden; }
.menu-item { padding: 14px 20px; cursor: pointer; font-size: 14px; color: #333; border-left: 3px solid transparent; transition: all 0.2s; }
.menu-item:hover { background: #fff0f0; color: #e4393c; }
.menu-item.active { border-left-color: #e4393c; color: #e4393c; font-weight: 600; background: #fff5f5; }
.menu-item.danger { color: #f56c6c; }
.main-content { flex: 1; }
.section { margin-bottom: 16px; }
.tabs { display: flex; gap: 0; margin-bottom: 16px; background: #fff; border-radius: 8px; overflow: hidden; }
.tabs span { flex: 1; text-align: center; padding: 10px 0; cursor: pointer; font-size: 13px; color: #666; border-bottom: 2px solid transparent; transition: all 0.2s; }
.tabs span:hover { color: #e4393c; }
.tabs span.active { color: #e4393c; border-bottom-color: #e4393c; font-weight: 600; }
.empty { text-align: center; padding: 80px; color: #999; background: #fff; border-radius: 8px; }
.order-wrapper { margin-bottom: 8px; }
.order-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 8px 20px 16px; background: #fff; border-radius: 0 0 8px 8px; margin-bottom: 12px; }
.pagination { display: flex; justify-content: center; margin-top: 20px; }
</style>
