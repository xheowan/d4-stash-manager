<script setup lang="ts">
import { IItemAttribute } from '~/stores'

withDefaults(defineProps<{
    data: IItemAttribute,
    badge?: boolean
}>(), {
    data: () => initAttrModel(),
    badge: true
})
</script>

<template>
    <span v-bind="$attrs" :class="{ 'text-legendary': data.type == ItemAttributeType.LegendaryAspect }">
        <span v-if="badge && data.type == ItemAttributeType.LegendaryAspect" class="badge text-bg-warning">{{ $t('item_attribute_type.legendary_aspect') }}</span>
        {{ $t(`item_attributes.${data.id}`, data.values.length ? data.values : ['n', 'n']) }}
    </span>
</template>