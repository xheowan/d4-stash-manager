<script setup lang="ts">
import type CtrlAffixSearch from './CtrlAffixSearch.vue';
import { DataAffix, createI18nAffixes, findAffix } from '~/composables/affix';
import { useItem, convertItemTypeToCategory } from '~/composables/item';
import { FlagAction, ViewMode, SearchRule } from '~/composables/stash';
import { IItem, ItemType, ItemCategory } from '~/stores';
import { clone, enumKey } from '~/utils';

defineOptions({
  name: 'Home',
});

createI18nAffixes();

// init useStash
const {
    type: stashType,
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

const view = (item: IItem) => {
    viewData.value = item;
}

const displayLegendaryValues = (values?: number[], type?: ItemType) => {
    if (!type || !values)
        return values;

    // const bonusMark = type === ItemType.Amulet || convertItemTypeToCategory(type) === ItemCategory.TwoHandedWeapons;

    let _values = values.map(String);
    if (type === ItemType.Amulet)
        _values = values.map(m => (m / 1.5).toFixed() + '*');
    else if (convertItemTypeToCategory(type) === ItemCategory.TwoHandedWeapons)
        _values = values.map(m => (m / 2).toFixed() + '*');

    return `[ ${_values.join(', ')} ]`;
}

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
// {{ $t(`ui.stash_type.${stashType}`) }}
</script>

<template>
    <div class="stash mt-2">
        <h4>
            My Stash：
            <select v-model="stashType" class="form-select form-select-sm d-inline-block w-auto">
                <option value="data">{{ $t('ui.stash_type.data') }}</option>
                <option value="season">{{ $t('ui.stash_type.season') }}</option>
            </select>
        </h4>
        <div class="top-toolbar bg-light">
            <div class="d-flex justify-content-between py-2">
                <div class="col-md-6 col-8 text-start">
                    <button type="button" class="btn btn-info me-2" @click="showSearch = true">{{ $t('ui.search') + (searchRules.length ? ` (${searchRules.length})` : '') }}</button>
                    <button type="button" class="btn btn-secondary" @click="changeView">{{ $t(`ui.swith_view.${mode == ViewMode.Tab ? 'legendary' : 'tab'}`) }}</button>
                </div>
                <div class="col-md-6 col-4 text-end">
                    <button type="button" class="btn btn-primary me-2" @click="showCreate = true">{{ $t('ui.fast_create') }}</button>
                </div>
            </div>
        </div>

        <div class="group-view">
            <div v-for="(items, key) in groupList" :key="key" class="group mt-4">
                <header class="group-head py-2 bg-white">
                    <template v-if="mode == ViewMode.Tab">
                        <h4>{{ `Tab ${key}` }}</h4>
                    </template>
                    <template v-else-if="mode == ViewMode.Legendary && key !== 'other'">
                        <h5 class="legendary-mark text-legendary text-truncate">
                            [{{ $t(`item_affix_prefix.${key}`) }}]
                            {{ $t(`item_attributes.${key}`, ['n', 'n']) }}
                        </h5>
                        <small class="text-body-secondary d-block mb-2">{{ findAffix(key as string)?.itemTypeSlot?.map(m => $t(`item_type.${m}`)).join(', ') }}</small>
                    </template>
                    <template v-else>
                        <h5>{{ $t('ui.group_not_legendary_type') }}</h5>
                    </template>
                </header>
                <div class="table-responsive-md">
                    <table class="table table-hover">
                        <colgroup>
                            <col v-if="mode == ViewMode.Legendary" class="col-md-1">
                            <col v-else class="col-md-1">
                            <col class="col-md-1">
                            <col class="col-md-2">
                            <col class="col-md-1">
                            <col :class="[(mode == ViewMode.Legendary ? 'col-md-4' : 'col-md-5')]">
                            <col v-if="mode == ViewMode.Legendary" class="col-md-1">
                            <col class="col-md-2">
                        </colgroup>
                        <thead>
                            <tr>
                                <th v-if="mode == ViewMode.Legendary" scope="col">{{ $t('ui.item_legendary_values') }}</th>
                                <th v-else scope="col">#</th>
                                <th scope="col">{{ $t('form.item_power') }}</th>
                                <th scope="col">{{ $t('form.item_quality') }}</th>
                                <th scope="col">{{ $t('form.item_type') }}</th>
                                <th scope="col">{{ $t('form.item_name') }}</th>
                                <th v-if="mode == ViewMode.Legendary" scope="col"><div class="text-truncate">{{ $t('form.item_stash_tab') }}</div></th>
                                <th scope="col" />
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr v-for="(item, num) in items" :key="item.id" rol="button" @click="view(item)">
                                <td v-if="mode == ViewMode.Legendary" :title="item.legendary?.values.join(', ')">
                                    <span :class="{ 'text-body-secondary': (item.type === ItemType.Amulet || convertItemTypeToCategory(item.type) === ItemCategory.TwoHandedWeapons) }">
                                        {{ displayLegendaryValues(item.legendary?.values, item.type) }}
                                    </span>
                                </td>
                                <th v-else scope="row">{{ num + 1 }}</th>
                                <td>{{ item.itemPower }}</td>
                                <td>
                                    <BadgeQuality :items="item.quality" />
                                </td>
                                <td>
                                    <div v-if="item.type">{{ $t(`item_type.${enumKey(ItemType, Number(item.type))}`) }}</div>
                                </td>
                                <td><div class="text-truncate" :title="item.name">{{ item.name }}</div></td>
                                <td v-if="mode == ViewMode.Legendary">{{ item.stashTab }}</td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-success me-2" @click.stop="modify(item)">{{ $t('ui.edit') }}</button>
                                    <button type="button" class="btn btn-sm" :class="[(item.flags.includes(FlagAction.Remove) ? 'btn-warning' : 'btn-outline-warning')]" @click.stop="flagItem(FlagAction.Remove, item.id)">{{ $t(item.flags.includes(FlagAction.Remove) ? 'ui.delete_flagged' : 'ui.flag_remove') }}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="Object.keys(groupList).length === 0" class="text-center mt-5">
                <b style="width: 400px;">{{ $t('ui.stash_no_data') }}</b>
            </div>
        </div>

        <div v-show="flaggedItemCount > 0" class="bottom-toolbar bg-light">
            <div class="container">
                <div class="d-flex justify-content-end py-2">
                    <button type="button" class="btn btn-danger" :disabled="!flaggedItemCount" @click="removeFlaggedItem()">{{ $t('ui.delete_all_flagged_item') + ` (${flaggedItemCount})` }}</button>
                </div>
            </div>
        </div>
    </div>

    <!--create-->
    <Modal v-model:show="showCreate" :title="$t('ui.fast_create')">
        <ModalFastCreate @submit="createItem" />
    </Modal>
    <!--modify-->
    <Modal v-model:show="showModify" :title="$t('ui.edit')">
        <ModalForm :model="model" @submit="modifyItem" />
    </Modal>
    <!--view-->
    <Modal v-model:show="showView" :title="$t('ui.view_item')">
        <template #body>
            <ItemView :model="viewData" />
        </template>
        <template #footer>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-danger me-2" @click="removeItem(viewData?.id as string)">{{ $t('ui.remove') }}</button>
                <button type="button" class="btn btn-success" @click="modify(viewData)">{{ $t('ui.edit') }}</button>
            </div>
        </template>
    </Modal>
    <!--search-->
    <Modal v-model:show="showSearch" :title="$t('ui.search')">
        <template #body>
            <CtrlAffixSearch ref="ctrlSearch" v-model="ctrlSarchAffixes" />
        </template>
        <template #footer>
            <div class="d-flex justify-content-end">
                <button v-if="searchRules.length > 0" type="button" class="btn btn-outline-secondary me-2" @click="resetSearch">{{ $t('ui.reset_search') }}</button>
                <button type="button" class="btn btn-outline-primary" @click="search">{{ $t('ui.search') }}</button>
            </div>
        </template>
    </Modal>
</template>

<style lang="scss" scoped>
.top-toolbar {
    position: sticky;
    z-index: 999;
    top: 0;

    @supports (padding: max(0px)) {
        padding-top: env(safe-area-inset-top);
    }
}

.bottom-toolbar {
    position: fixed;
    z-index: 999;
    bottom: 0;
    width: 100%;
    left: 0;

    @supports (padding: max(0px)) {
        padding-bottom: env(safe-area-inset-bottom);
    }
}

.table {
    th, td {
        white-space: nowrap;
    }
}

.group-head {
    position: sticky;
    top: 54px;

    h4 {
        margin-bottom: 0;
    }
}

.group-view {
    margin-bottom: 60px;
}

</style>
