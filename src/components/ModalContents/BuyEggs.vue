<template>
  <div class="flex">
    <div class="flex items-center">
      <div class="eggs-frame">
        <img class="img-h" :src="`/egg1.png`" />
      </div>
    </div>
    <a-spin tip="Loading..." :spinning="approving || purchasing">
      <div class="arena-container">
        <div class="arena-title">Buy Eggs</div>
        <div class="arena-introduce">Select an Egg to purchase</div>
        <div class="pt-12 pb-6">
          <div class="py-2 font-bold" style="font-size: 16px">Token select</div>
          <a-dropdown :trigger="['click']" placement="bottomCenter">
            <div class="token-select">
              <div class="token-select-left">
                <img class="token-icon" :src="`/tokens/${tokenSymbol.toLowerCase()}.svg`" />
                <div class="token-select-content">
                  <div class="token-symbol">{{ tokenSymbol }}</div>
                  <div
                    class="token-select-balance"
                  >Balance: {{ formatNumber(tokenBalance) }} {{ tokenSymbol }}</div>
                </div>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <template #overlay>
              <div class="select-token-dropdown">
                <li v-for="(t, idx) in tokens" :key="t.address" @click="selectToken(idx)">
                  <div class="flex">
                    <img class="token-icon" :src="`/tokens/${t.symbol.toLowerCase()}.svg`" />
                    <div>
                      <div class="font-bold">{{ t.symbol }}</div>
                      <div style="font-size: 12px">{{ t.address }}</div>
                    </div>
                  </div>
                </li>
              </div>
            </template>
          </a-dropdown>
        </div>
        <div>
          <div class="py-2 font-bold" style="font-size: 16px">Eggs quantity (Default: 1)</div>

          <div class="flex egg-count-inner">
            <div class="flex" @click="handleClickQuantity">
              <span
                :class="{
                  active: !isInputQuantity && buyEggAmount == quantityItem.label
                }"
                v-for="quantityItem in quantityList"
                :key="quantityItem.label"
              >{{ quantityItem.label }}</span>
            </div>

            <input
              v-model="quantity"
              @focus="isInputQuantity = true"
              @blur="quantity === '' && (isInputQuantity = false)"
              @input="quantity = quantity.replace(/[^\d]/g, '')"
              type="text"
              :class="[
                'quantity-input',
                'focus:outline-none',
                'focus:shadow-outline',
                { active: isInputQuantity }
              ]"
              :style="approving || purchasing ? 'pointer-events: none' : ''"
              placeholder="other"
            />
          </div>
        </div>

        <div class="form-column mt-6">
          <div>1 Eggs price</div>
          <div class="px-4 font-bold" style="color: #ff761a">
            <span class="px-2">{{ unitPrice }}</span>
            <span>{{ tokenSymbol }}</span>
          </div>
        </div>

        <div class="form-column">
          <div>Balance</div>
          <div class="px-4 font-bold" style="color: #ff761a">
            <span class="px-2">{{ formatNumber(tokenBalance) }}</span>
            <span>{{ tokenSymbol }}</span>
          </div>
        </div>

        <div class="form-column">
          <div>Buy Eggs</div>
          <div class="px-4 font-bold" style="color: #ff761a">{{ buyEggAmount }}</div>
        </div>

        <div class="form-column">
          <div>Total Price</div>
          <div class="px-4 font-bold" style="color: #ff761a">
            <span class="px-2">{{ formatNumber(totalPrice) }}</span>
            <span>{{ tokenSymbol }}</span>
          </div>
        </div>
        <div class="flex justify-center mt-12">
          <color-button
            @click="handlePurchase"
            :disabled="
              !wallet.connected || insufficientBalance || zeroEggs || approving || purchasing
            "
          >
            <LoadingOutlined v-show="approving || purchasing" class="px-2 font-bold" spin />
            {{
              !wallet.connected
                ? 'Wallet Not Connected'
                : insufficientBalance
                  ? `Insufficient ${tokenSymbol} Balance`
                  : zeroEggs
                    ? 'Number of eggs cannot be 0'
                    : approving
                      ? 'Approving...'
                      : purchasing
                        ? 'purchasing...'
                        : `Purchase ${eggAmount} Eggs With ${formatNumber(
                          totalPrice
                        )} ${tokenSymbol}`
            }}
          </color-button>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { NullsEggManager } from '@/contracts'
import { addDecimal, formatNumber, removeDecimal, guid } from '@/utils/common'

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
      totalPrice: 1,
      unitPrice: 1,
      quantity: '',
      isInputQuantity: false,
      buyEggAmount: 1,
      approving: false,
      purchasing: false,

      eggManagerContract: undefined,
      tokenContract: undefined,

      updateBalanceInterval: undefined,
      tokenBalance: 0,

      contractTokenDecimal: undefined,
      selectedTokenIndex: 0,
      tokens: [
        {
          symbol: 'USDT',
          address: '0x04F535663110A392A6504839BEeD34E019FdB4E0',
          decimal: 6
        },
        {
          symbol: 'T-NET',
          address: '0x6aA7CF4F83c6a88cABD93b40D47E7144311882B8',
          decimal: 6
        }
      ]
    }
  },

  async created() {
    // Create contracts
    this.eggManagerContract = this.wallet.createContract(NullsEggManager)

    this.subscribeToken()
  },
  watch: {
    quantity(newVal) {
      let value = newVal.replace(/[^\d]/g, '') || 1
      this.totalPrice = this.unitPrice * value
      this.buyEggAmount = value + ''
    },
    buyEggAmount(newVal) {
      this.totalPrice = this.unitPrice * (newVal.replace(/[^\d]/g, '') || 1)
    }
  },
  computed: {
    eggAmount() {
      return this.quantity || 1
    },
    insufficientBalance() {
      return this.tokenBalance < this.totalPrice
    },
    currentToken() {
      return this.tokens[this.selectedTokenIndex]
    },
    tokenSymbol() {
      return this.currentToken.symbol
    },
    tokenAddress() {
      return this.currentToken.address
    },
    tokenDecimal() {
      return this.contractTokenDecimal || this.currentToken.decimal
    },
    zeroEggs() {
      return this.buyEggAmount < 1
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
    async updateBalance() {
      this.tokenBalance = removeDecimal(await this.tokenContract['balanceOf'](this.wallet.address), this.tokenDecimal)
    },
    select(key) {
      this.selected = key
    },
    async subscribeToken() {
      this.tokenContract = this.wallet.createERC20(this.tokenAddress)

      // Get decimals
      this.contractTokenDecimal = await this.tokenContract['decimals']()
      // Get unitPrice
      this.unitPrice = removeDecimal(await this.eggManagerContract['getPrice'](this.tokenAddress), this.contractTokenDecimal)

      clearInterval(this.updateBalanceInterval)
      this.updateBalance().then(() => {
        this.updateBalanceInterval = setInterval(this.updateBalance, 10_000)
      })
    },
    selectToken(idx) {
      this.selectedTokenIndex = idx
      this.subscribeToken()
    },
    async handlePurchase() {
      if (this.approving) return

      await this.wallet.approveAndSend({
        handle: 'BuyEggs',
        approveContract: this.tokenContract,
        approveChecker: addDecimal(this.eggAmount * this.unitPrice, this.tokenDecimal),
        component: this,
        transcationFactory: async () => {
          return await this.eggManagerContract['buy'](
            this.eggAmount,
            this.tokenAddress
          )
        },
        transcationOptions: {
          statusProps: 'purchasing',
          onComplete: () => this.updateBalance(),
          messages: {
            startTitle: 'Purchasing Eggs 📑',
            waitingTitle: 'Waiting for Purchasing result 📑',
            successTitle: 'Successful purchase ✔️',
            successContent: `Successfully purchased ${this.eggAmount} eggs, please check in MyEggs!`,
            errorTitle: 'Purchasing failed ❌'
          }
        }
      })

    },
    handleClickQuantity(e) {
      if (e.target.tagName.toLowerCase() === 'span') {
        this.isInputQuantity = false
        this.buyEggAmount = e.target.innerText
      }
    }
  }
}
</script>

<style lang="less" scoped>
.eggs-frame {
  padding: 30px;
  border-radius: 10px;
  border: 2px solid #ff742733;
  background-color: #fff4c333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 10px 10px;
  transition: 0.2s ease;
}

.img-h {
  width: 144px;
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

.quantity-input {
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  border: 2px solid #c4c3c3;
  background: transparent;
  width: 100%;
  margin-right: 20px;
  text-align: center;
}

.token-select {
  min-width: 440px;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 14px 16px;
  border-radius: 6px;
  border: 2px solid #ff981a;
  transition: 0.2s ease;
}

.select-token-dropdown {
  border: 2px solid #ff981a;
  user-select: none;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.select-token-dropdown :deep(li) {
  padding: 15px;
  transition: 0.2s ease;
  cursor: pointer;
}

.select-token-dropdown :deep(li:first-child) {
  border-radius: 8px 8px 0 0;
}

.select-token-dropdown :deep(li:last-child) {
  border-radius: 0 0 8px 8px;
}

.select-token-dropdown :deep(li:hover) {
  background-color: #efefef;
}

.select-token-dropdown :deep(li:active) {
  filter: brightness(0.9);
}

.token-select-content {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  font-size: 16px;
}

.token-select-balance {
  font-size: 14px;
}

.token-symbol {
  font-weight: bold;
}

.token-icon {
  margin-right: 15px;
  height: 42px;
  width: 42px;
  padding: 0 4px;
}

.token-select:hover {
  background-color: #ff981a4d;
}

.token-select-left {
  display: flex;
  flex: 1;
}

.arena-container {
  padding: 20px 40px;
}

.form-column {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  padding: 4px 0;
}

.form-column div:first-child {
  font-weight: bold;
}

.arena-introduce {
  font-size: 16px;
  padding: 15px;
  text-align: center;
}

.arena-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #111111;
  line-height: 40px;
}

.egg-count-inner {
  margin-top: 2px;

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
    transition: 0.2s ease;

    &.active {
      color: #ff7427;
      border-color: #ff7427;
    }
  }

  .quantity-input {
    width: 100px;
    height: 34px;
    padding: 5px 10px;
    font-size: 18px;
    border-radius: 8px;
    border: 1px solid #aaa;
    background: transparent;
    font-weight: normal;
    text-align: center;

    &.active {
      color: #ff7427;
      border-color: #ff7427;
    }
  }
}
</style>
