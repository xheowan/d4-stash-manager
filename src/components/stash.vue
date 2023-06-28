<script setup lang="ts">

const {
    items
} = useStash();


</script>

<template>
    <div class="stash">
        <h4>My Stash</h4>
        <div>
            list
            <equipment 
                v-for="item in items"
                :key="item.id"
                :data="item"
            />
        </div>
    </div>
</template>