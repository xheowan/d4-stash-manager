<script setup lang="ts">
import { IItemAttribute } from '~/stores';
import { orderBy } from 'lodash-es';

const props = withDefaults(defineProps<{
    data: IItemAttribute[]
}>(), {
    data: () => []
});

const { data } = toRefs(props);

const list = computed(() => orderBy(data.value, ['type', 'rank'], ['asc', 'asc']));
</script>

<template>
    <ul v-if="data.length" v-bind="$attrs">
        <li v-for="item in list" :key="item.id" :class="`type-${item.type}`">
            {{ $t(`item_attributes.${item.id}`, item.values) }}
        </li>
    </ul>
</template>

<style lang="scss" scoped>
/* purgecss start ignore */
ul {
    // list-style: none;
    // padding-left: 0;

    // li.type-1 {
    //     list-style: none;
    // }

    // li.type-2 {
    //     list-style: '';
    // }

    li.type-3 {
        color: #e5771f;
        // list-style: '⭑';
    }
}
/* purgecss end ignore */
</style>