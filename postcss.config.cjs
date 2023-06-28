const purgecss = require('@fullhuman/postcss-purgecss');
const autoprefixer = require('autoprefixer');
const vuePath = /\.vue(\?.+)?$/;

module.exports = {
    plugins: [
        purgecss({
            // contentFunction: (sourceFile) => {
            //     console.log('=== contentFunction');

            //     if (vuePath.test(sourceFile)) {
            //         return [sourceFile.replace(vuePath, '.vue')];
            //     }
            //     return [
            //         'src/**/*.js',
            //         'src/**/*.ts',
            //         'src/**/*.vue',
            //         'index.html'
            //     ];
            // },
            // defaultExtractor(content) {
            //     if (content.startsWith('<template')) {
            //         content = content.split('</template')[0] + '</template>';
            //     }

            //     return content.match(/[\w-/:]+(?<!:)/g) || [];
            // },
            content: [
                'src/components/**/*.vue',
                'src/composables/**/*.vue',
                'src/layouts/**/*.vue',
                'src/pages/**/*.vue',
                'src/plugins/**/*.{js,ts}',
                'App.vue',
            ],
            defaultExtractor: (content) => {
                const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '') // Remove inline vue styles
                return contentWithoutStyleBlocks.match(/[\w-.:/]+(?<!:)/g) || [] // Default extractor
            },
            skippedContentGlobs: ['node_modules/**'],
            safelist: {
                standard: [
                    'body',
                    'html',
                    /-(leave|enter|appear)(|-(to|from|active))$/, // Normal transitions
                    /^router-link(|-exact)-active$/, // Nuxt link classes
                    /^(?!cursor-move).+-move$/, // Move transitions
                    /.*data-v-.*/, // Keep scoped styles
                    // New Vue3 selectors
                    /:slotted/,
                    /:deep/,
                    /:global/,
                    // custom
                    'a',
                    /was-validated/,
                    /mapboxgl.*/,
                    /icon/,
                    /svg-icon/,
                    'modal-dialog-bottom',
                ],
                greedy: [/splide/, /icon/, /nprogress/]
            }
        }),
        autoprefixer()
    ]
};