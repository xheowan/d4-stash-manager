<script setup lang="ts">
import { IItem } from '~/stores';

const siteVersion = import.meta.env.VITE_SITE_VERSION;

const {
    type: stashType,
    dataImport,
    dataExport
} = useStash();

const showDataManager = ref(false);
const showFileInput = ref(false);
watch(showDataManager, (nval) => {
    !nval && (showFileInput.value = false);
});

const importFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result as string;
            const jsonData = JSON.parse(result);

            dataImport(jsonData as IItem[]);
            showDataManager.value = false;
        };

        // 讀取文件內容
        reader.readAsText(file);
    }
}

</script>
<template>
    <nav class="navbar bg-body-tertiary">
        <div class="container d-flex flex-wrap">
            <a class="navbar-brand" href="/">
                <!-- <img src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top"> -->
                D4 Stash Manager
                <small class="text-body-secondary">{{ `v${siteVersion}` }}</small>
            </a>
            <ul class="nav">
                <!-- <li class="nav-item pe-2">
                    <select v-model="stashType" class="form-select form-select-sm">
                        <option value="data">{{ $t('ui.stash_type.data') }}</option>
                        <option value="season">{{ $t('ui.stash_type.season') }}</option>
                    </select>
                </li> -->
                <li class="nav-item">
                    <button type="button" class="btn btn-sm btn-outline-secondary" @click="showDataManager = true">{{ $t('ui.data_manager') }}</button>
                </li>
            </ul>
        </div>
    </nav>
    <main v-cloak class="container">
        <RouterView />
    </main>
    <Modal v-model:show="showDataManager" :title="$t('ui.data_manager')" size="sm">
        <template #body>
            <div class="mb-3">{{ $t('ui.stash_type_title') }}：<b>{{ $t(`ui.stash_type.${stashType}`) }}</b></div>
            <div class="d-grid gap-2">
                <template v-if="!showFileInput">
                    <button type="button" class="btn btn-lg btn-outline-info" @click="showFileInput = true">{{ $t('ui.data_import') }}</button>
                    <button v-if="!showFileInput" type="button" class="btn btn-lg btn-outline-primary" @click="dataExport">{{ $t('ui.data_export') }}</button>
                </template>
                <div v-else>
                    <label for="data-import-input-file" class="form-label">{{ $t('ui.data_import_input_label') }}</label>
                    <input id="data-import-input-file" type="file" class="form-control" accept=".json" @change="importFile($event)" />
                </div>
            </div>
        </template>
    </Modal>
</template>