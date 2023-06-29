<script setup lang="ts">
import type { IItem } from '~/stores';

interface Props {
    data: IItem
}

defineProps<Props>();

</script>

<template>
    <div class="stash-item">
        {{ data }}
    </div>
</template>