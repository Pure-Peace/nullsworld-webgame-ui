<template>
  <div class="w-full sm:mt-8 md:mt-0 lg:mt-0 xl:mt-0 flex-1">
    <div class="item-list-card">
      <div class="item-list-card-header">
        <div class="item-list-card-header-tabs">
          <button class="item-list-card-header-button item-list-card-header-button-active">
            <span class="item-list-card-header-button-text">My Eggs</span>
          </button>
        </div>
      </div>
      <div class="item-list-card-body" style="min-height: 50vh;">
        <NeedWalletConnect @onWalletConnect="init" @onAddressChange="init" @onWalletDisconnect="onDisconnect">
          <div class="my-nulls-content px-14 py-14 pb-14">
            <div class="egg-list">
              <GoBuyEggs />
              <Eggs @onButtonClick="$root.openGlobalModal('hatchEggs')" :amount="eggBalance" />
            </div>
          </div>
        </NeedWalletConnect>
      </div>
    </div>
  </div>
</template>


<script>
import { NullsEggToken, NullsEggManager } from '@/contracts'


import Eggs from '@/components/Items/EggItem.vue'
import GoBuyEggs from '@/components/Items/GoBuyEggs.vue'
import BuyEggs from '@/components/ModalContents/BuyEggs.vue'

export default {
  components: {
    Eggs, GoBuyEggs, BuyEggs
  },
  data() {
    return {
      eggBalance: 0,
      eggContract: undefined,
      eggManagerContract: undefined,
      updateBalanceInterval: undefined,
    }
  },
  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateBalanceInterval)
  },
  methods: {
    onDisconnect() {
      clearInterval(this.updateBalanceInterval)
    },
    async init() {
       if (!this.wallet.connected) return
      clearInterval(this.updateBalanceInterval)

      // Create contracts
      this.eggContract = this.wallet.createContract(NullsEggToken)
      this.eggManagerContract = this.wallet.createContract(NullsEggManager)


      this.updateEggBalance().then(() => {
        this.updateBalanceInterval = setInterval(this.updateEggBalance, 10_000);
      })
    },
    async updateEggBalance() {
      this.eggBalance = Number(await this.eggContract['balanceOf'](this.wallet.address))
    },
    randColor() {
      const items = ['rare-blue', 'rare-purple', 'rare-red', 'rare-orange']
      return items[Math.floor(Math.random() * items.length)]
    },
    isActiveFilter(filter) {
      return this.selectedFilter === filter.value
    },
    selectFilter(filter) {
      this.selectedFilter = filter.value
    },
    fetchData(id) {
      this.$refs[id].openInterface()
    }
  }
}

</script>

<style scoped>
.item-list-card-header-button {
  padding: 0 50px;
}

.my-nulls-content {
  display: flex;
  justify-content: center;
}

.egg-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
