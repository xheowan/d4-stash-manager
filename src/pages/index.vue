<script setup lang="ts">
import { DataAffix } from '~/composables/affix';
import { useItem } from '~/composables/item';
import { FlagAction, ViewMode, SearchRule } from '~/composables/stash';
import { IItem } from '~/stores';
import { clone, enumKey } from '~/utils';
import type CtrlAffixSearch from './CtrlAffixSearch.vue';

defineOptions({
  name: 'Home',
});

// init useStash
const {
    groupList,
    viewMode: mode,
    changeView,

    addItem,
    updateItem,
    removeItem,

    flagItem,
    removeFlaggedItem,
    flaggedItemCount,

    searchRules,
    removeSearch
} = useStash();


// fast create & create
const showCreate = ref(false);

const createItem = (data: IItem, show: boolean) => {
    if (data) {
        addItem(data);
        showCreate.value = show;
    }
}

// view item
const viewData = ref<IItem>();
const showView = computed({
    get: () => viewData.value ? true : false,
    set: (value) => {
        if (!value)
            viewData.value = undefined;
    }
});

// edit & update
const {
    model
} = useItem();

const showModify = ref(false);
watch(showModify, (val) => {
    if (!val) {
        model.value = initItemModel();
    }
});

const modify = (data: IItem | undefined) => {
    if (!data)
        return;

    model.value = clone(data);
    showModify.value = true;

    if (showView.value) {
        showView.value = false;
    }
}

const modifyItem = () => {
    if (model.value.id) {
        updateItem(model.value);
        showModify.value = false;
    }
}


// search
const ctrlSearch = ref<InstanceType<typeof CtrlAffixSearch> | null>(null);
const ctrlSarchAffixes = ref<DataAffix[]>([]);
const tempSearchRules = ref<SearchRule[]>([]);

const showSearch = ref(false);

const resetSearch = () => {
    ctrlSearch.value?.reset();
    ctrlSarchAffixes.value = [];
    tempSearchRules.value = [];
    removeSearch();
}

const search = () => {
    searchRules.value = [
        ...ctrlSarchAffixes.value.map(m => ({
            type: 'affix',
            value: m.id
        } as SearchRule)),
        ...tempSearchRules.value
    ];
    showSearch.value = false;
}
</script>

<template>
    <div class="stash mt-2">
        <h4>My Stash</h4>
        <div class="d-flex justify-content-between mb-3">
            <div class="col text-start">
                <button type="button" class="btn btn-primary me-2" @click="showCreate = true">{{ $t('ui.fast_create') }}</button>
                <button type="button" class="btn btn-info me-2" @click="showSearch = true">{{ $t('ui.search') + (searchRules.length ? ` (${searchRules.length})` : '') }}</button>
                <button type="button" class="btn btn-secondary mt-2 mt-md-0" @click="changeView">{{ $t(`ui.swith_view.${mode == ViewMode.Tab ? 'legendary' : 'tab'}`) }}</button>
            </div>
            <div class="col text-end">
                <button type="button" class="btn btn-danger" :disabled="!flaggedItemCount" @click="removeFlaggedItem()">{{ $t('ui.delete_all_flagged_item') }}</button>
            </div>
        </div>

        <div class="group-view">
            <div v-for="(items, key) in groupList" :key="key" class="group mt-4">
                <h5>
                    <template v-if="mode == ViewMode.Tab">
                        {{ `Tab ${key}` }}
                    </template>
                    <template v-else-if="mode == ViewMode.Legendary && key !== 'other'">
                        <div class="legendary-mark text-legendary text-truncate">{{ $t(`item_attributes.${key}`, ['n', 'n']) }}</div>
                    </template>
                    <template v-else>
                        {{ $t('ui.group_type_other') }}
                    </template>
                </h5>
                <div class="table-responsive-md">
                    <table class="table table-hover">
                        <colgroup>
                            <col class="col-md-1">
                            <col class="col-md-2">
                            <col class="col-md-1">
                            <col :class="[(mode == ViewMode.Legendary ? 'col-md-4' : 'col-md-5')]">
                            <col class="col-md-1">
                            <col v-if="mode == ViewMode.Legendary" class="col-md-1">
                            <col class="col-md-2">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{{ $t('form.item_quality') }}</th>
                                <th scope="col">{{ $t('form.item_type') }}</th>
                                <th scope="col">{{ $t('form.item_name') }}</th>
                                <th scope="col">{{ $t('form.item_power') }}</th>
                                <th v-if="mode == ViewMode.Legendary" scope="col">{{ $t('ui.item_legendary_values') }}</th>
                                <th scope="col" />
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(item, num) in items" :key="item.id" rol="button" @click="viewData = item">
                                <th scope="row">{{ num + 1 }}</th>
                                <td><BadgeQuality :items="item.quality" /></td>
                                <td>{{ $t(`item_type.${enumKey(ItemType, Number(item.type))}`) }}</td>
                                <td><div class="text-truncate" :title="item.name">{{ item.name }}</div></td>
                                <td>{{ item.itemPower }}</td>
                                <td v-if="mode == ViewMode.Legendary">{{ item.legendary?.values }}</td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-success me-2" @click.stop="modify(item)">{{ $t('ui.edit') }}</button>
                                    <button type="button" class="btn btn-sm" :class="[(item.flags.includes(FlagAction.Remove) ? 'btn-warning' : 'btn-outline-warning')]" @click.stop="flagItem(FlagAction.Remove, item.id)">{{ $t(item.flags.includes(FlagAction.Remove) ? 'ui.delete_flagged' : 'ui.flag_remove') }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="Object.keys(groupList).length === 0" class="text-center mt-5">{{ $t('ui.no_data') }}</div>
        </div>
    </div>

    <!--create-->
    <Modal v-model:show="showCreate" :title="$t('ui.fast_create')">
        <ItemFastCreate @submit="createItem" />
    </Modal>
    <!--modify-->
    <Modal v-model:show="showModify" :title="$t('ui.edit')">
        <ItemForm :model="model" @submit="modifyItem" />
    </Modal>
    <!--view-->
    <Modal v-model:show="showView" :title="$t('ui.view_item')">
        <ItemView :model="viewData" />
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-danger me-2" @click="removeItem(viewData?.id as string)">{{ $t('ui.remove') }}</button>
            <button type="button" class="btn btn-success" @click="modify(viewData)">{{ $t('ui.edit') }}</button>
        </div>
    </Modal>
    <!--search-->
    <Modal v-model:show="showSearch" :title="$t('ui.search')">
        <CtrlAffixSearch ref="ctrlSearch" v-model="ctrlSarchAffixes" />
        <div class="d-flex justify-content-end">
            <button v-if="searchRules.length > 0" type="button" class="btn btn-outline-secondary me-2" @click="resetSearch">{{ $t('ui.reset_search') }}</button>
            <button type="button" class="btn btn-outline-primary" @click="search">{{ $t('ui.search') }}</button>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.table {
    th, td {
        white-space: nowrap;
    }
}
</style>
