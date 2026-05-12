<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: number
    min?: number
    max?: number
}>(), {
    min: 1,
    max: 999,
})

const emit = defineEmits<{
    'update:modelValue': [value: number]
}>()

const decrease = () => {
    if (props.modelValue > props.min) {
        emit('update:modelValue', props.modelValue - 1)
    }
}
const increase = () => {
    if (props.modelValue < props.max) {
        emit('update:modelValue', props.modelValue + 1)
    }
}
</script>

<template>
    <div class="quantity-selector">
        <button class="qty-btn" @click="decrease" :disabled="modelValue <= (min ?? 1)">−</button>
        <span class="qty-value">{{ modelValue }}</span>
        <button class="qty-btn" @click="increase" :disabled="modelValue >= (max ?? 999)">+</button>
    </div>
</template>

<style scoped>
.quantity-selector {
    display: inline-flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
.qty-btn {
    width: 30px;
    height: 30px;
    border: none;
    background: #f5f5f5;
    font-size: 18px;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
}
.qty-btn:hover:not(:disabled) {
    background: #e6e6e6;
}
.qty-btn:disabled {
    color: #c0c4cc;
    cursor: not-allowed;
}
.qty-value {
    width: 44px;
    text-align: center;
    font-size: 14px;
    color: #333;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    line-height: 30px;
}
</style>
