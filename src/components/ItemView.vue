<script setup lang="ts">
import type { IItem } from '~/stores';
import { enumKey } from '~/utils';

const props = defineProps<{
    model?: IItem
}>();

const { t } = useI18n();

const isLegendary = computed(() => props.model?.attributes.some(s => s.type === ItemAttributeType.LegendaryAspect));

const qualityTypeName = computed(() => {
    let arr: string[] = [];

    if (props.model?.quality) {
        arr = props.model.quality
            .map(m => t(`item_quality.${enumKey(ItemQuality, m)}`));
    }

    if (props.model?.type) {
        arr.push(t(`item_type.${enumKey(ItemType, props.model?.type)}`));
    }

    return arr.join('');
});

</script>

<template>
    <div v-if="model" class="stash-item">
        <h3 class="mb-2" :class="{ 'text-legendary': isLegendary }">
            {{ model.name }}
        </h3>
        <div v-if="model.quality.length" class="mb-1" :class="{ 'text-legendary': isLegendary }">
            {{ qualityTypeName }}
        </div>
        <div v-if="model.itemPower" class="mb-2">
            {{ `${$t('form.item_power')} ${model.itemPower}` }}
        </div>
        <div class="mb-2">
            <ItemAffixView :data="model.attributes" />
        </div>
        <div v-if="model.requiredLevel" class="mb-2 text-end">
            {{ `${$t('form.item_required_level')} ${model.requiredLevel}` }}
        </div>
        <div v-if="model.stashTab" class="text-end text-body-secondary">
            {{ `${$t('form.item_stash_tab')} ${model.stashTab}` }}
        </div>
    </div>
</template>