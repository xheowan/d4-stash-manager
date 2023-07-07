<script setup lang="ts">
import { enumKey } from '~/utils';

type QualityTypeClass = {
    [key: number]: string
}

const props = defineProps<{
    items: number[]
}>();


const dicClassName: QualityTypeClass = {
    1: 'text-bg-secondary',
    2: 'text-bg-primary',
    3: 'text-bg-warning',
    4: 'text-bg-legendary',
    5: 'text-bg-unique',
    6: 'text-bg-light',
    7: 'text-bg-light'
};

const list = computed(() => {
    return props.items
        .map(m => ({
            key: enumKey(ItemQuality, m),
            className: dicClassName[m]
        }));
});
</script>

<template>
    <span v-for="item in list" :key="item.key" class="badge me-1" :class="item.className">
        {{ $t(`item_quality.${item.key}`) }}
    </span>
</template>