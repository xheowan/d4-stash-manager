<script setup lang="ts">
import type { IItem } from '~/stores';

defineOptions({
  name: 'Home',
});

const {
    groupList,
    add
} = useStash();


const model = ref<IItem>();
const showEditor = ref(false);

const open = () => {
    model.value = initItemModel();
    showEditor.value = true;
}

const save = () => {
    if (!model.value) {
        return;
    }

    add(model.value);
    showEditor.value = false;
}

</script>

<template>
    <h2>d4 stash manager</h2>

    <div class="stash">
        <h4>My Stash</h4>
        <button type="button" class="btn btn-secondary" @click="open">{{ $t('form.text_create') }}</button>

        <div class="mt-3">
            <div v-for="(list, idx) in groupList" :key="idx" class="tab">
                <h5>Tab {{ idx }}</h5>
                <ItemView 
                    v-for="item in list"
                    :key="item.id"
                    :data="item"
                />
            </div>
        </div>
    </div>

    <Modal 
        v-model:show="showEditor" 
        :title="$t(model?.id ? 'form.text_update' : 'form.text_create')"
    >
        <ItemEditorForm :model="model" @submit="save" />
    </Modal>
</template>

<route lang="yaml">
</route>
