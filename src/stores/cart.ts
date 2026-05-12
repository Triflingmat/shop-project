import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Goods } from '@/types'
import {
    getCartList,
    addToCart as addToCartApi,
    updateCartItem as updateCartItemApi,
    checkAllCart,
    deleteCartItem,
    clearCheckedCart,
    clearCart as clearCartApi,
    type BackendCartItem,
} from '@/api/cart'

/**
 * 购物车 Store —— 对接后端 Cart API
 */
export const useCartStore = defineStore('cart', () => {
    // --- State ---
    const items = ref<BackendCartItem[]>([])
    const loading = ref(false)

    // --- Getters ---
    const selectedItems = computed(() => items.value.filter((i) => i.checked === 1))
    const totalPrice = computed(() =>
        selectedItems.value.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)
    )
    const totalCount = computed(() =>
        selectedItems.value.reduce((sum, i) => sum + i.quantity, 0)
    )
    const cartCount = computed(() =>
        items.value.reduce((sum, i) => sum + i.quantity, 0)
    )

    // --- Actions ---

    /** 从后端加载购物车 */
    const fetchCart = async () => {
        loading.value = true
        try {
            const res = await getCartList()
            items.value = Array.isArray(res) ? res : []
        } catch {
            items.value = []
        } finally {
            loading.value = false
        }
    }

    /** 添加商品到购物车 */
    const addItem = async (goods: Goods, quantity: number = 1) => {
        await addToCartApi({
            goods_id: goods.id,
            goods_name: goods.name,
            goods_img: goods.goods_img,
            price: goods.price,
            quantity: Math.min(quantity, goods.stock),
        })
        await fetchCart()
    }

    /** 更新数量 */
    const updateQuantity = async (cartId: number, goodsId: number, quantity: number, checked: number) => {
        await updateCartItemApi({ id: cartId, quantity, checked })
        // 本地即时更新
        const item = items.value.find((i) => i.id === cartId)
        if (item) item.quantity = quantity
    }

    /** 切换选中 */
    const toggleSelect = async (cartId: number) => {
        const item = items.value.find((i) => i.id === cartId)
        if (item) {
            const newChecked = item.checked === 1 ? 0 : 1
            await updateCartItemApi({ id: cartId, quantity: item.quantity, checked: newChecked })
            item.checked = newChecked
        }
    }

    /** 全选/取消全选 */
    const toggleSelectAll = async () => {
        if (items.value.length === 0) return
        const allSelected = items.value.every((i) => i.checked === 1)
        const newChecked = allSelected ? 0 : 1
        await checkAllCart(newChecked)
        items.value.forEach((i) => (i.checked = newChecked))
    }

    /** 清除已选中（下单后调用） */
    const clearSelected = async () => {
        await clearCheckedCart()
        await fetchCart()
    }

    /** 删除商品 */
    const removeItem = async (cartId: number) => {
        await deleteCartItem(cartId)
        await fetchCart()
    }

    /** 清空购物车 */
    const clearCart = async () => {
        await clearCartApi()
        await fetchCart()
    }

    return {
        items,
        loading,
        selectedItems,
        totalPrice,
        totalCount,
        cartCount,
        fetchCart,
        addItem,
        removeItem,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        clearSelected,
        clearCart,
    }
})
