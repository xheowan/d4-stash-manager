import path from 'node:path';
import { defineConfig } from 'vite';

import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    resolve: {
        alias: {
            '~/': `${path.resolve(__dirname, 'src')}/`,
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "~/assets/styles/default";`
            }
        }
    },
    plugins: [
        Vue(),
        // https://github.com/hannoeru/vite-plugin-pages
        Pages({
            extensions: ['vue'],
        }),

        // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
        Layouts(),

        // https://github.com/antfu/unplugin-auto-import
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'vue-i18n',
                'pinia',
                '@vueuse/head',
                // '@vueuse/core',
            ],
            dirs: [
                'src/composables',
                'src/stores',
            ],
            dts: 'src/auto-imports.d.ts',
            vueTemplate: true,
        }),

        // https://github.com/antfu/unplugin-vue-components
        Components({
            // allow auto load markdown components under `./src/components/`
            extensions: ['vue'],
            // allow auto import and register components used in markdown
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            dts: 'src/components.d.ts',
        }),

        // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
        VueI18n({
            runtimeOnly: true,
            compositionOnly: true,
            fullInstall: true,
            include: [path.resolve(__dirname, 'locales/**')],
        }),

        // https://github.com/antfu/vite-plugin-pwa
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
            manifest: {
                name: 'Vitesse',
                short_name: 'Vitesse',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
        script: 'async',
        formatting: 'minify',
        crittersOptions: {
            reduceInlineStyles: false,
        },
        mock: true,
    },

    ssr: {
        // TODO: workaround until they support native ESM
        noExternal: ['workbox-window', /vue-i18n/],
    },
})
