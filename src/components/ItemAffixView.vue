<script setup lang="ts">
import { IItemAttribute } from '~/stores';
import { orderBy } from '~/utils';

const props = withDefaults(defineProps<{
    data: IItemAttribute[],
    edit?: boolean
}>(), {
    data: () => [],
    edit: false
});

defineEmits(['update', 'remove']);

const { data } = toRefs(props);

const list = computed(() => orderBy(data.value, ['type', 'rank'], ['asc', 'asc']));

// const baseAffiex = computed(() => list.value.filter(m => m.type === ItemAttributeType.Property));
// const otherAffix = computed(() => list.value.filter(m => m.type !== ItemAttributeType.Affix));
</script>

<template>
    <ul v-if="data.length" v-bind="$attrs">
        <li 
            v-for="(item, idx) in list" 
            :key="item.id" 
            :tabindex="idx" 
            class="px-1"
            :class="[(edit ? 'py-2' : 'py-1'), `type-${item.type}`]"
            role="button"
        >
            <ItemAffix :data="item" />
            <!-- <div class="flex-fill my-1">{{ $t(`item_attributes.${item.id}`, item.values) }}</div> -->
            <div class="options btn-group" role="group">
                <button v-if="edit" type="button" class="btn btn-sm btn-success" @click="$emit('update', item)">{{ $t('ui.edit') }}</button>
                <button v-if="edit" type="button" class="btn btn-sm btn-danger" @click="$emit('remove', item)">{{ $t('ui.remove') }}</button>
            </div>
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

    

    li {
        position: relative;

        &.type-3 {
            list-style-image: url(../assets/images/legendary-star.webp);
            // color: #dca779;
        }
    }

    .options {
        position: absolute;
        right: 0;
        top: 0.25rem;
    }

    li:not(:hover):not(:focus) {
        .options {
            display: none;
        }
    }

    li:hover, li:focus {
        background-color: $gray-200;
    }
}
/* purgecss end ignore */
</style>