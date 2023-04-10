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
          <slot name="title"></slot>
        </div>
        <slot v-bind:params="params"></slot>
      </div>
    </div>
    <button
      :class="[!closeable ? 'modal__close__disabled' : '', 'modal__close']"
      @click="() => { $emit('close'); close()}"
    ></button>
  </vue-final-modal>
</template>

<script>
export default {
  name: 'CustomModal',
  inheritAttrs: false,
  props: {
    closeable: {
      default: true
    }
  }
}
</script>

<style scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  background: #fff;
  border-radius: 30px;
  padding: 10px;
}

.modal-border {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #ffffff;
  border-radius: 24px;
  border: 4px dashed #fbede8;
}

.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}
.modal__close {
  cursor: pointer;
  width: 57px;
  height: 54px;
  position: absolute;
  right: -22px;
  top: -23px;
  background-image: url('/close.png');
  background-repeat: round;
  transition: 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.modal__title {
  font-size: 18px;
  font-weight: bold;
}

.modal__close:hover {
  transform: scale(1.1);
  filter: brightness(1.1);
}

.modal__close:active {
  transform: scale(1.1) translateY(2px);
  filter: brightness(0.9);
}

.dark-mode div:deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}

.modal__close__disabled {
  pointer-events: none;
}
</style>
