<template>
  <NeedWalletConnect
    @onWalletConnect="init"
    @onAddressChange="init"
    @onWalletDisconnect="onDisconnect"
  >
    <div class="filter-bar px-12 py-10">
      <div class="records-count">
        <img src="/market.png" style="height: 34px;" class="mr-2" />
        Found
        <span class="font-bold mx-2">{{ total }}</span> transactions
      </div>

      <div class="flex items-center mt-10">
        <div
          @click="selectFilter(filter)"
          :class="[
            isActiveFilter(filter) ? 'filter-item-active' : '',
            'filter-item mr-10'
          ]"
          v-for="filter in filters"
          :key="filter"
        >
          <img src="/meat2.png" v-show="isActiveFilter(filter)" />
          <span>{{ filter.text }}</span>
        </div>
      </div>
    </div>
    <a-spin tip="Loading..." :spinning="fetching" delay="50">
      <empty class="mt-16" v-show="txRecords?.length < 1" />
      <div>
        <div
          class="info-item info-item-big justify-between items-center"
          v-for="record in txRecords"
          :key="record.id"
        >
          <div class="flex items-center">
            <div class="ml-14">
              <a-image class="ring-image" :src="`/nulls${calcNullsImage(record.pet_id)}.png`" />
            </div>
            <div class="ml-6">
              <div class="info-title">
                <span :class="[calcColor(record.id), 'tx-record-id']">#{{ record.id }}</span>
                <span>Successfully {{ txText(record) }}</span>
                <span class="px-2 font-bold">Nulls</span>
                <span :class="[calcColor(record.pet_id), 'nulls-id']">#{{ record.pet_id }}</span>
              </div>
              <div class="flex items-center">
                <a-tooltip>
                  <template #title>
                    <div>
                      <span class="font-bold">UTC+0:</span>
                      {{ formatDate(record.create_time, { fmt: 'YYYY-MM-DD HH:mm:ss:SSSS', local: false }) }}
                    </div>
                    <div>
                      <span class="font-bold">Timestamp:</span>
                      {{ record.create_time }}
                    </div>
                  </template>
                  <div class="info-time">{{ formatDate(record.create_time, { fromNow: true }) }}</div>
                </a-tooltip>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="info-vs ml-8">
              <div class="player items-end">
                <div>
                  <span
                    :class="imBuyer(record) ? 'isMe' : ''"
                  >{{ imBuyer(record) ? 'You' : 'Buyer' }}</span>
                </div>
                <a-tooltip>
                  <template #title>
                    Buyer address:
                    <div class="font-bold">{{ record.buy_user_address }}</div>
                  </template>
                  <a
                    :href="accountExplorer(record.buy_user_address)"
                    target="_blank"
                    class="address"
                  >({{ cutEthAddress(record.buy_user_address, 6) }})</a>
                </a-tooltip>
              </div>
              <div class="player items-start">
                <div>
                  <span
                    :class="imSeller(record) ? 'isMe' : ''"
                  >{{ imSeller(record) ? 'You' : 'Seller' }}</span>
                </div>
                <a-tooltip>
                  <template #title>
                    Seller address:
                    <div class="font-bold">{{ record.sell_user_address }}</div>
                  </template>
                  <a
                    :href="accountExplorer(record.sell_user_address)"
                    target="_blank"
                    class="address"
                  >({{ cutEthAddress(record.sell_user_address, 6) }})</a>
                </a-tooltip>
              </div>
            </div>
            <a-tooltip>
              <template #title>
                {{ record.current }} Contract:
                <div class="font-bold">{{ record.current_contract }}</div>
              </template>
              <div :class="[imSeller(record) ? 'color-green' : 'color-red', 'price ml-8 mr-12']">
                {{ imSeller(record) ? '+' : '-' }}{{ removeDecimal(record.price, record.current_precision) }}
                {{ record.current }}
              </div>
            </a-tooltip>

            <a-tooltip>
              <template #title>
                Transcation Hash:
                <a
                  :href="txExplorer(record.tx_hash)"
                  target="_blank"
                  style="font-weight: bold;"
                >{{ record.tx_hash }}</a>
              </template>
              <a :href="txExplorer(record.tx_hash)" target="_blank">
                <color-button buttonStyle="blue">View</color-button>
              </a>
            </a-tooltip>
          </div>
        </div>
      </div>
    </a-spin>
    <div class="paging-bar px-10 pb-10 pt-4">
      <a-pagination
        @change="fetchData(false)"
        show-quick-jumper
        v-model:current="page"
        :total="total"
        show-less-items
      />
    </div>
  </NeedWalletConnect>
</template>


<script>
import empty from '@/components/Common/EmptyStatus.vue'
import { formatNumber, calcColor, calcNullsImage, txExplorer, accountExplorer, formatDate, removeDecimal, cutEthAddress } from '@/utils/common'
import { Trading } from '@/backends'

export default {
  components: {
    empty
  },
  data() {
    return {
      formatNumber,
      calcColor,
      calcNullsImage,
      txExplorer,
      accountExplorer,
      formatDate,
      removeDecimal,
      cutEthAddress,
      txRecords: [],
      page: 1,
      pageSize: 10,
      total: 0,
      updateInterval: -1,
      fetching: true,
      selectedFilter: 0,
      filters: [
        {
          text: 'Nulls transactions',
          value: 0
        },
        {
          text: 'Egg purchase',
          value: 1
        },
        {
          text: 'Egg hatching',
          value: 2
        }
      ],
    }
  },
  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  methods: {
    onDisconnect() {
      clearInterval(this.updateInterval)
    },
    async init() {
      if (!this.wallet.connected) return
      clearInterval(this.updateInterval)

      this.fetchData()
      this.updateInterval = setInterval(() => {
        this.fetchData(true)
      }, 10000)
    },
    async fetchData(isAutoUpdate = false) {
      if (!isAutoUpdate) this.fetching = true
      const { data } = await Trading.findSellByAddress({
        address: this.wallet.address,
        pageSize: this.pageSize,
        current: this.page
      })
      this.fetching = false
      if (data.code != 200) return this.$message.error(data.message)
      this.total = data.data.count
      this.txRecords = data.data.rows

    },
    isActiveFilter(filter) {
      return this.selectedFilter === filter.value
    },
    selectFilter(filter) {
      this.selectedFilter = filter.value
      this.fetchData()
    },
    txText(record) {
      if (this.imBuyer(record)) return 'purchased'
      if (this.imSeller(record)) return 'sold'
    },
    imSeller(record) {
      return record.sell_user_address.toLowerCase() === this.wallet.address
    },
    imBuyer(record) {
      return record.buy_user_address.toLowerCase() === this.wallet.address
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  flex-direction: column;
  /* border-bottom: 3px dashed #aeceff4d; */
}

.filter-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #111111;
  user-select: none;
  cursor: pointer;
  transition: 0.2s ease;
  padding: 10px;
  border-radius: 8px;
}

.filter-item img {
  height: 33px;
  padding-right: 0.5rem;
}

.filter-item:hover {
  color: #00367f;
  font-weight: bold;
  background-color: #aeceff4d;
}

.filter-item-active {
  color: #00367f;
  font-weight: bold;
  background-color: #aeceff4d;
}

.records-count {
  display: flex;
  align-items: center;
  color: #00367f;
  font-size: 28px;
  margin-right: 24px;
  background-color: #aeceff4d;
  border-radius: 16px;
  padding: 16px 32px;
  font-style: italic;
}

.info-title {
  font-size: 18px;
  font-weight: 400;
  color: #00367f;
}

.paging-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

:deep(.ant-image) {
  width: 54px;
  margin-right: 10px;
  transition: 0.2s ease;
}

:deep(.ant-image:hover) {
  transform: scale(1.2);
}

.nulls-id {
  border-radius: 16px;
  padding: 4px 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
}

.tx-record-id {
  border-radius: 8px;
  margin-right: 10px;
  padding: 4px 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.color-green {
  color: #01ba96;
  border-color: #01ba96;
}

.color-red {
  color: #ff6262;
  border-color: #ff6262;
}

.price {
  font-size: 16px;
  font-weight: bold;
}

.info-vs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
}

.address {
  padding: 4px 0;
  font-size: 12px;
}

.isMe {
  color: #01ba96;
  font-weight: bold;
}

.player {
  display: flex;
  flex-direction: column;
  color: #111111;
  padding: 0 20px;
}
</style>