<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
    title: import.meta.env.VITE_SITE_NAME,
    meta: [
        { name: 'description', content: 'Diablo IV Stash Manager' },
    ],
    link: [
        {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/favicon.svg',
        },
    ],
})
</script>

<template>
    <RouterView />
</template>
