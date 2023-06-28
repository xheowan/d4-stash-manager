<script setup lang="ts">
import type { IItem } from '~/stores/stash';

interface Props {
    data: IItem
}

defineProps<Props>();

</script>

<template>
    <div class="stash-item">
        this is equipment
        {{ data }}
    </div>
</template>