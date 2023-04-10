<template>
    <vue-final-modal
        v-slot="{ params, close }"
        v-bind="$attrs"
        classes="modal-container"
        content-class="modal-content"
    >
        <div class="modal__content">
            <div class="modal-border">
                <div class="modal__title">
                    <slot name="title">
                        <div class="flex justify-end">
                            <button class="modal__close" @click="() => { $emit('close'); close() }"></button>
                        </div>
                    </slot>
                </div>
                <slot v-bind:params="params"></slot>
            </div>
        </div>
    </vue-final-modal>
</template>

<script>
export default {
    name: 'CombatReplayModal',
    inheritAttrs: false
}
</script>

<style scoped>
:deep(.modal-content) {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal__close {
    cursor: pointer;
    width: 47px;
    height: 44px;
    margin-top: 30px;
    background-image: url("/close.png");
    background-repeat: round;
    transition: 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.modal__close:hover {
    transform: scale(1.1);
    filter: brightness(1.1);
}

.modal__close:active {
    transform: scale(1.1) translateY(2px);
    filter: brightness(0.9);
}
</style>