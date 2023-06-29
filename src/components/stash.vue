<script setup lang="ts">
import type { IItem } from '~/stores';

const {
    items
} = useStash();

const model = ref<IItem>();

const add = () => {
    model.value = initItemModel();
}

</script>

<template>
    <div class="stash">
        <h4>My Stash</h4>
        <button v-if="!model" type="button" class="btn btn-secondary" @click="add">Add</button>

        <div>
            list
            <Item 
                v-for="item in items"
                :key="item.id"
                :data="item"
            />
        </div>

        <ItemEditor v-if="model" :model="model" />
    </div>
</template>