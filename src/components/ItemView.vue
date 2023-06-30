<script setup lang="ts">
import type { IItem } from '~/stores';

interface Props {
    data: IItem
}

defineProps<Props>();

const stash = useStash();

const modify = () => {
    
}

</script>

<template>
    <div class="stash-item">
        {{ data }}

        <button type="button" class="btn btn-sm btn-success" @click="modify">{{ $t('ui.update') }}</button>
        <button type="button" class="btn btn-sm btn-danger" @click="stash.removeItem(data.id as string)">{{ $t('ui.remove') }}</button>
    </div>
</template>