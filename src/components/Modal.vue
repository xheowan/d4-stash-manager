<script>
export default defineComponent({
    inheritAttrs: false,
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: null
        },
        mode: {
            type: String,
            default: 'content' //content, screen (full)
        },
        closeBtn: {
            type: Boolean,
            default: true
        },
        // background: {
        //     type: String,
        //     default: 'white' //black, white
        // },
        backdrop: {
            type: Boolean,
            default: true
        },
        dialogPosition: {
            type: String,
            default: 'bottom' //bottom, centered
        },
        teleport: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:show'],
    setup(props) {
        const { show, mode, backdrop, dialogPosition } = toRefs(props); //background, 

        const isCreate = ref(false);
        // modal element exists or not
        const isShow = ref(show.value);
        // modal show or not
        const isVisible = ref(show.value);

        // // modal style
        // const modalStyle = computed(() => ({
        //     display: isShow.value ? 'block' : 'none'
        // }));

        // // modal class
        // const modalClass = computed(() => ({
        //     'show': isVisible.value,
        //     // 'content-only': mode.value === 'content',
        // }));

        // modal-dialog class
        const dialogClass = computed(() => ({
            [`modal-dialog-${dialogPosition.value}`]: !!dialogPosition.value,
            'modal-fullscreen': mode.value === 'screen'
        }));

        // modal-content class
        // const contentClass = computed(() => ({
        //     'bg-white': background.value === 'white',
        //     'bg-black': background.value === 'black'
        // }));

        const backdropHidden = computed(() => {
            return !backdrop.value || !isShow.value;
        });

        const classNameOpen = 'modal-open';
        const doShow = () => {
            if (!isCreate.value)
                isCreate.value = true;

            document.body.classList.add(classNameOpen);
            isVisible.value = true;

            // setTimeout(() => {
            //     isShow.value = true;
            // }, 100);
            nextTick(() => {
                isShow.value = true;
            });
        }

        const doHide = () => {
            isShow.value = false;
            document.body.classList.remove(classNameOpen);

            // setTimeout(() => {
            //     isVisible.value = false;
            // }, 100);

            nextTick(() => {
                isVisible.value = false;
            });
        }

        // toggle
        watch(show, (value) => {
            value ? doShow() : doHide();
        });

        // show ? doShow() : doHide();

        return {
            isCreate,
            isShow,
            isVisible,

            // modalStyle,
            // modalClass,
            dialogClass,
            // contentClass,
            backdropHidden
        }
    }
})
</script>
<template>
    <Teleport to="body" :disabled="!teleport">
        <div
            v-if="isCreate"
            class="modal fade"
            :class="{ 'show': isShow }"
            :style="{ 'display': isVisible ? 'block' : 'none' }"
            v-bind="$attrs"
            tabindex="-1"
            aria-hidden="true"
        >
            <div class="modal-dialog" :class="dialogClass">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-if="title" class="modal-title">{{ title }}</h5>
                        <button
                            v-if="closeBtn"
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="$emit('update:show', false)"
                        />
                    </div>
                    <div class="modal-body">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!backdropHidden" class="modal-backdrop fade" :class="{ 'show': isVisible }" />
    </Teleport>
</template>

<style lang="scss">

</style>