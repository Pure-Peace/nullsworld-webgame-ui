<template>
  <div v-if="!wallet.connected || !wallet.isCorrectNetwork" class="wallet-connect-hint">
    <div class="wallet-connect-title">{{ walletConnectHint }} ❌</div>
    <div class="p-6">
      <color-button @click="handleButtonClick">{{ buttonText }}</color-button>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script>
export default {
  emits: ['onWalletConnect', 'onAddressChange', 'onWalletDisconnect'],
  watch: {
    'wallet.connected': function (newVal, oldVal) {
      if (newVal === oldVal) return
      else if (newVal === true) this.$emit('onWalletConnect')
      else if (newVal === false) this.$emit('onWalletDisconnect')
    },
    'wallet.address': function (newVal, oldVal) {
      if (newVal === oldVal || !oldVal) return
      else if (newVal) this.$emit('onAddressChange', newVal)
    },
    'wallet.chainId': function (newVal, oldVal) {
      if (newVal === oldVal) return
      else if (newVal) this.$emit('onNetworkChange', newVal)
    }
  },
  computed: {
    walletConnectHint() {
      if (!this.wallet.connected) return 'Wallet connection required'
      else if (!this.wallet.isCorrectNetwork) return 'Incorrect Network'
    },
    buttonText() {
      if (!this.wallet.connected) return '⚔️ Connect Wallet ⚔️'
      else if (!this.wallet.isCorrectNetwork) return '⚔️ Switch Network ⚔️'
    }
  },
  methods: {
    handleButtonClick() {
      if (!this.wallet.connected) return this.$root.openGlobalModal('walletConnect')
      else if (!this.wallet.isCorrectNetwork) return this.wallet.switchNetwork()
    }
  }
}
</script>

<style scoped>
.wallet-connect-hint {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.wallet-connect-title {
  color: #00367f;
  font-size: 22px;
  font-weight: bold;
  background-color: #aeceff4d;
  padding: 20px 30px;
  border-radius: 24px;
  user-select: none;
  margin: 20px;
}

.color-button {
  font-size: 24px;
  padding: 15px 30px;
}
</style>
