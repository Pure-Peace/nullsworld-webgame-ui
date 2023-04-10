<template>
  <a-spin tip="Loading..." :spinning="approving || hatching">
    <div class="eggs-container">
      <div class="eggs-title">Hatch eggs</div>
      <div class="eggs-introduce">nulls will treat the first person they see as a parent</div>
      <NeedWalletConnect
        @onWalletConnect="init"
        @onAddressChange="init"
        @onWalletDisconnect="onDisconnect"
      >
        <div class="price-text mt-4">You have {{ formatNumber(eggBalance) }} Eggs</div>
        <div class="egg-list">
          <div
            :class="`eggs-frame ${selected == key ? 'eggs-frame-opt' : ''}`"
            v-for="(item, key) in list"
            :key="key"
            @click="select(key, item)"
          >
            <img class="img-h" :src="`/${item.img}`" />
          </div>
        </div>

        <div class="egg-count-wrap mt-8">
          <p class="title">Hatch of pet eggs (default: 1)</p>
          <div class="flex egg-count-inner">
            <div class="flex" @click="handleClickQuantity">
              <span
                :class="{
                  active: !isInputQuantity && openEggAmount == quantityItem.label
                }"
                v-for="quantityItem in quantityList"
                :key="quantityItem.label"
              >{{ quantityItem.label }}</span>
            </div>
            <input
              v-model="quantity"
              @focus="isInputQuantity = true"
              @blur="quantity === '' && (isInputQuantity = false)"
              @input="quantityChange"
              type="text"
              :class="[
                'quantity-input',
                'focus:outline-none',
                'focus:shadow-outline',
                { active: isInputQuantity }
              ]"
              :style="approving || hatching ? 'pointer-events: none' : ''"
              placeholder="other"
            />
          </div>
        </div>
        <div class="flex justify-center mt-8">
          <color-button
            @click="handleHatch"
            :disabled="
              !wallet.connected || zeroEggs || insufficientEggs || approving || hatching
            "
          >
            <LoadingOutlined v-show="approving || hatching" class="px-2 font-bold" spin />
            {{
              !wallet.connected
                ? 'Wallet Not Connected'
                : insufficientEggs
                  ? 'Insufficient Eggs'
                  : zeroEggs
                    ? 'Number of eggs cannot be 0'
                    : approving
                      ? 'Approving...'
                      : hatching
                        ? 'Hatching...'
                        : `Hatch ${openEggAmount} Eggs`
            }}
          </color-button>
        </div>
      </NeedWalletConnect>
    </div>
  </a-spin>
</template>

<script>
import { NullsEggToken, NullsEggManager } from '@/contracts'
import { addDecimal, formatNumber, removeDecimal, guid } from '@/utils/common'
import { MyEggs } from '@/backends'
import { markRaw, } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    LoadingOutlined
  },
  data() {
    return {
      addDecimal,
      formatNumber,
      removeDecimal,
      maxOpen: 20,
      selected: '0',
      width: '287px',
      list: [
        {
          img: 'egg1.png'
        }
      ],

      quantity: '',
      isInputQuantity: false,
      hatching: false,
      approving: false,
      openEggAmount: 1,

      eggBalance: 0,
      eggContract: markRaw({}),
      eggManagerContract: markRaw({}),
      updateBalanceInterval: undefined
    }
  },
  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateBalanceInterval)
  },
  watch: {
    quantity(newVal) {
      const v = Number(newVal.replace(/[^\d]/g, '') || 1)
      this.openEggAmount = v > 20 ? 20 : v
    }
  },
  computed: {
    insufficientEggs() {
      return !this.eggBalance || this.openEggAmount > this.eggBalance
    },
    zeroEggs() {
      return this.openEggAmount < 1
    },
    quantityList() {
      return [
        {
          label: 1
        },
        {
          label: 5
        },
        {
          label: 10
        },
        {
          label: 20
        }
      ]
    }
  },
  methods: {
    async init() {
      if (!this.wallet.address) return
      clearInterval(this.updateBalanceInterval)

      // Create contracts
      this.eggContract = markRaw(this.wallet.createContract(NullsEggToken))
      this.eggManagerContract = markRaw(this.wallet.createContract(NullsEggManager))

      this.wallet.watchContractEvent(this.eggManagerContract, 'EggNewNonce', event => {

      })

      this.wallet.watchContractEvent(this.eggManagerContract, 'NewPet', event => {

      })

      await this.updateEggBalance()
      this.updateBalanceInterval = setInterval(this.updateEggBalance, 10_000)
    },
    onDisconnect() {
      clearInterval(this.updateBalanceInterval)
    },
    async updateEggBalance() {
      this.eggBalance = Number(await this.eggContract['balanceOf'](this.wallet.address))
    },
    select(key) {
      this.selected = key
    },
    async readyOpenEggs() {
      const { timestamp, status } = await this.wallet.getLatestBlockTimestamp()
      if (!status) return { err: 'Could not get latest block time' }

      const { code, data } = (await MyEggs.getItemId()).data
      if (code !== 200) return { err: 'Could not get itemId, please try again.' }
      return {
        itemId: data.item_id,
        deadline: timestamp + 1800,
        err: undefined
      }
    },
    async handleHatch() {
      if (!this.eggBalance) return

      // Ready to hatch
      const { itemId, deadline, err } = await this.readyOpenEggs()
      if (err) {
        this.$notification.open({
          message: 'OpenEggs: Hatching failed ❌',
          description: err,
          duration: 2
        })
        return
      }

      // Hatch
      await this.wallet.approveAndSend({
        handle: 'OpenEggs',
        approveContract: this.eggContract,
        approveChecker: this.openEggAmount,
        component: this,
        transcationFactory: async () => {
          return await this.eggManagerContract['openMultiple'](this.openEggAmount, itemId, deadline)
        },
        transcationOptions: {
          statusProps: 'hatching',
          onComplete: () => this.updateEggBalance(),
          messages: {
            startTitle: 'Hatching Eggs 📑',
            waitingTitle: 'Waiting for Hatching result 📑',
            successTitle: 'Successful Hatching ✔️',
            successContent: `Successfully hatched ${this.openEggAmount} eggs, please check in MyNulls!`,
            errorTitle: 'Hatching failed ❌'
          }
        }
      })
    },
    quantityChange() {
      let value = this.quantity.replace(/[^\d]/g, '')
      this.quantity = +value > 20 ? '20' : value
    },
    handleClickQuantity(e) {
      if (e.target.tagName.toLowerCase() === 'span') {
        this.isInputQuantity = false
        this.openEggAmount = e.target.innerText
      }
    }
  }
}
</script>

<style lang="less" scoped>
.eggs-container {
  padding: 20px 40px;
}

.eggs-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #111111;
  line-height: 40px;
}

.egg-list {
  margin-top: 23px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.eggs-frame {
  width: 170px;
  height: 188px;
  border-radius: 10px;
  border: 2px solid #e3d0c3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 10px 10px;
  transition: 0.2s ease;
}

.img-h {
  height: 126px;
}

.eggs-frame:hover {
  background-color: #fff2ea;
}

.eggs-frame:hover img {
  /* animation: shake 2s 0.15s ease-in-out infinite; */
}

.eggs-frame:active {
  border-color: #ff7427;
  transform: scale(0.95);
}

.eggs-frame:active .img-h {
  filter: brightness(0.9);
}

.eggs-frame-opt {
  background-color: #fff2ea;
  border: 2px solid #ff7427;
}

.eggs-introduce {
  font-size: 16px;
  padding: 15px;
  text-align: center;
}

@keyframes shake {
  10% {
    transform: scale(1.1) rotate(15deg);
  }
  20% {
    transform: scale(1.1) rotate(-10deg);
  }
  30% {
    transform: scale(1.1) rotate(5deg);
  }
  40% {
    transform: scale(1.1) rotate(-5deg);
  }
  50%,
  100% {
    transform: rotate(0deg);
  }
}

.color-button {
  height: 46px;
  font-size: 18px;
}

.price-text {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: #ff7427;
}

.egg-count-wrap {
  .title {
    margin-bottom: 10px;
    font-size: 18px;
    color: #00367f;
  }

  .egg-count-inner {
    span {
      margin-right: 25px;
      width: 57px;
      height: 34px;
      line-height: 32px;
      color: #111;
      font-size: 18px;
      text-align: center;
      border-radius: 8px;
      border: 1px solid #aaa;
      cursor: pointer;

      &.active {
        color: #ff7427;
        border-color: #ff7427;
      }
    }

    .quantity-input {
      width: 80px;
      height: 34px;
      padding: 5px 10px;
      font-size: 18px;
      border-radius: 8px;
      border: 1px solid #aaa;
      background: transparent;
      text-align: center;

      &.active {
        color: #ff7427;
        border-color: #ff7427;
      }
    }
  }
}
</style>
