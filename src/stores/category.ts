import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import { getCategoryList } from '@/api/category'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])

    const fetchCategories = async () => {
        const res = await getCategoryList()
        categories.value = res.list || []
    }

    return { categories, fetchCategories }
})
