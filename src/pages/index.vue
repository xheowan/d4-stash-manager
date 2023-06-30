<script setup lang="ts">
import type { IItem } from '~/stores';
import { clone } from 'lodash-es';
import { ItemQuality } from '~/stores';

defineOptions({
  name: 'Home',
});

const {
    groupList,
    addItem,
    updateItem,
    removeItem
} = useStash();


const model = ref<IItem>();
const showEditor = ref(false);

const open = (data?: IItem) => {
    model.value = data ? clone(data) : initItemModel();
    showEditor.value = true;
}

const save = () => {
    if (!model.value) {
        return;
    }

    if (!model.value.id) {
        addItem(model.value);
    } else {
        updateItem(model.value);
    }

    showEditor.value = false;
}
</script>

<template>
    <h2>d4 stash manager</h2>

    <div class="stash">
        <h4>My Stash</h4>
        <button type="button" class="btn btn-secondary" @click="open()">{{ $t('ui.create') }}</button>

        <div class="mt-3">
            <div v-for="(list, idx) in groupList" :key="idx" class="tab">
                <h5>Tab {{ idx }}</h5>

                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t('form.item_power') }}</th>
                            <th scope="col">{{ $t('form.item_type') }}</th>
                            <th scope="col">{{ $t('form.item_quality') }}</th>
                            <th scope="col">{{ $t('form.item_name') }}</th>
                            <th scope="col">options</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="(item, num) in list" :key="item.id">
                            <th scope="row">{{ num + 1 }}</th>
                            <td>{{ item.itemPower }}</td>
                            <td>{{ item.type }}</td>
                            <td>
                                <span v-for="qlt in item.quality" :key="qlt" class="badge text-bg-primary me-1">{{ $t(`item_quality.${ItemQuality[qlt].toLocaleLowerCase()}`) }}</span>
                            </td>
                            <td>{{ item.name }}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-success me-2" @click="open(item)">{{ $t('ui.update') }}</button>
                                <button type="button" class="btn btn-sm btn-danger" @click="removeItem(item.id as string)">{{ $t('ui.remove') }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Modal 
        v-model:show="showEditor" 
        :title="$t(model?.id ? 'ui.update' : 'ui.create')"
    >
        <ItemForm :model="model" @submit="save" />
    </Modal>
</template>

<route lang="yaml">
</route>
