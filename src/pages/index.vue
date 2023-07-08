<script setup lang="ts">
import { DataAffix } from '~/composables/affix';
import { useItem } from '~/composables/item';
import { FlagAction, ViewMode } from '~/composables/stash';
import { IItem } from '~/stores';
import { clone, enumKey } from '~/utils';

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

    flagItem,
    removeFlaggedItem,
    flaggedItemCount
} = useStash();


// fast create & create
const showCreate = ref(false);

const createItem = (data: IItem, show: boolean) => {
    if (data) {
        addItem(data);
        showCreate.value = show;
    }
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

const modify = (data: IItem) => {
    model.value = clone(data);
    showModify.value = true;
}

const modifyItem = () => {
    if (model.value.id) {
        updateItem(model.value);
        showModify.value = false;
    }
}

// search
const showSearch = ref(false);
const searchSelectedRules = ref<DataAffix[]>([]);

const search = () => {
    console.log(searchSelectedRules.value);
}
</script>

<template>
    <h2>d4 stash manager</h2>

    <div class="stash">
        <h4>My Stash</h4>
        <div class="d-flex justify-content-between mb-3">
            <div class="left">
                <button type="button" class="btn btn-primary me-2" @click="showCreate = true">{{ $t('ui.fast_create') }}</button>
                <button type="button" class="btn btn-info me-2" @click="showSearch = true" :disabled="true">{{ $t('ui.search') }}</button>
                <button type="button" class="btn btn-secondary" @click="changeView">{{ $t(`ui.swith_view.${mode == ViewMode.Tab ? 'legendary' : 'tab'}`) }}</button>
            </div>
            <div class="right">
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
                        <div class="text-legendary text-truncate">{{ $t(`item_attributes.${key}`, ['n', 'n']) }}</div>
                    </template>
                    <template v-else>
                        {{ $t('ui.group_type_other') }}
                    </template>
                </h5>

                <table class="table table-hover">
                    <colgroup>
                        <col class="col-1">
                        <col class="col-2">
                        <col class="col-1">
                        <col :class="[(mode == ViewMode.Legendary ? 'col-4' : 'col-5')]">
                        <col class="col-1">
                        <col v-if="mode == ViewMode.Legendary" class="col-1">
                        <col class="col-2">
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
                        <tr v-for="(item, num) in items" :key="item.id">
                            <th scope="row">{{ num + 1 }}</th>
                            <td><BadgeQuality :items="item.quality" /></td>
                            <td>{{ $t(`item_type.${enumKey(ItemType, Number(item.type))}`) }}</td>
                            <td><div class="text-truncate" :title="item.name">{{ item.name }}</div></td>
                            <td>{{ item.itemPower }}</td>
                            <td v-if="mode == ViewMode.Legendary">{{ item.legendary?.values }}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-success me-2" @click="modify(item)">{{ $t('ui.edit') }}</button>
                                <button type="button" class="btn btn-sm" :class="[(item.flags.includes(FlagAction.Remove) ? 'btn-warning' : 'btn-outline-warning')]" @click="flagItem(FlagAction.Remove, item.id)">{{ $t(item.flags.includes(FlagAction.Remove) ? 'ui.delete_flagged' : 'ui.flag_remove') }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Modal v-model:show="showCreate" :title="$t('ui.fast_create')">
        <ItemFastCreate @submit="createItem" />
    </Modal>

    <Modal v-model:show="showModify" :title="$t('ui.edit')">
        <ItemForm :model="model" @submit="modifyItem" />
    </Modal>

    <Modal v-model:show="showSearch" :title="$t('ui.search')">
        <CtrlAffixSearch v-model:items="searchSelectedRules" />
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-secondary" @click="search">{{ $t('ui.next_step') }}</button>
        </div>
    </Modal>
</template>

<route lang="yaml">
</route>
