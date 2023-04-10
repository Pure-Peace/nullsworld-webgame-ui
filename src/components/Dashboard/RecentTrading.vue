<template>
  <div class="w-full flex-1">
    <div class="item-list-card">
      <div class="item-list-card-header">
        <div class="item-list-card-header-tabs">
          <button class="item-list-card-header-button item-list-card-header-button-active">
            <span class="item-list-card-header-button-text">Nulls trading</span>
          </button>
        </div>
        <div v-if="showMoreButton" class="item-list-card-header-right">
          <button
            @click="navigateTo('RecentTrading')"
            class="item-list-card-detail-button pop-button"
          >
            <img src="/detail.png" />
          </button>
        </div>
      </div>
      <a-spin tip="Loading..." :spinning="fetching">
        <div class="item-list-card-body">
          <empty v-show="tradeRecords?.length < 1" />
          <router-link
            tag="div"
            :to="{ path: `/nulls/details/${record.pet_id}` }"
            class="info-item justify-between items-center"
            v-for="record in tradeRecords"
            :key="`${record.id}-trade-record`"
          >
            <div class="flex items-center">
              <a-image
                @click.stop
                class="ring-image"
                :src="`/nulls${calcNullsImage(record.pet_id)}.png`"
              />
              <div>
                <div :class="`info-block-num ${calcColor(record.pet_id)}`">#{{ record.pet_id }}</div>
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
            <div>
              <div class="info-title">Seller</div>
              <a-tooltip>
                <template #title>
                  Seller address:
                  <div class="font-bold">{{ record.sell_user_address }}</div>
                </template>
                <div class="info-text">
                  <a
                    :href="accountExplorer(record.sell_user_address)"
                    @click.stop
                    target="_blank"
                  >{{ ethAddress(record.sell_user_address) }}</a>
                </div>
              </a-tooltip>
            </div>
            <div>
              <div class="info-title">Buyer</div>
              <a-tooltip>
                <template #title>
                  Buyer address:
                  <div class="font-bold">{{ record.buy_user_address }}</div>
                </template>
                <div class="info-text">
                  <a
                    :href="accountExplorer(record.buy_user_address)"
                    @click.stop
                    target="_blank"
                  >{{ ethAddress(record.buy_user_address) }}</a>
                </div>
              </a-tooltip>
            </div>
            <div>
              <div class="info-title">Price</div>
              <a-tooltip>
                <template #title>
                  {{ record.current }} Contract:
                  <div class="font-bold">{{ record.current_contract }}</div>
                </template>
                <div class="info-text">
                  <a
                    :href="accountExplorer(record.current_contract)"
                    @click.stop
                    target="_blank"
                    style="font-weight: bold; color: #01ba96;"
                  >{{ formatNumber(removeDecimal(record.price, record.current_precision)) }} {{ record.current }}</a>
                </div>
              </a-tooltip>
            </div>
            <div>
              <a-tooltip>
                <template #title>
                  Transcation Hash:
                  <div class="font-bold">{{ record.tx_hash }}</div>
                </template>
                <a :href="txExplorer(record.tx_hash)" @click.stop target="_blank">
                  <button class="info-item-button pop-button">
                    <img src="/button2.png" />
                  </button>
                </a>
              </a-tooltip>
            </div>
          </router-link>
          <div v-if="pagination" class="pagination-bar">
            <a-pagination
              @change="fetchTradingRecord(false)"
              show-quick-jumper
              v-model:current="page"
              :total="recordsTotal"
              show-less-items
            />
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>


<script>
import { Trading } from '@/backends'
import { formatDate, cutEthAddress, removeDecimal, txExplorer, accountExplorer, calcColor, calcNullsImage, formatNumber } from '@/utils/common'

import empty from '@/components/Common/EmptyStatus.vue'

export default {
  components: {
    empty
  },
  data() {
    return {
      formatDate, cutEthAddress, removeDecimal, txExplorer, accountExplorer, calcColor, calcNullsImage, formatNumber,
      tradeRecords: [],
      page: 1,
      recordsTotal: 0,
      fetching: true,
      updateInterval: -1
    }
  },
  props: {
    pagination: {
      default: false
    },
    displayFullAddress: {
      default: false
    },
    pageSize: {
      default: 10
    },
    showMoreButton: {
      default: false
    }
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  async created() {
    await this.fetchTradingRecord()
    this.updateInterval = setInterval(() => {
      this.fetchTradingRecord(true)
    }, 10000)
  },
  computed: {
    infoTextWidth() {
      return this.displayFullAddress ? 'auto' : '98px'
    }
  },
  methods: {
    ethAddress(address) {
      return this.displayFullAddress ? address : cutEthAddress(address, 4)
    },
    async fetchTradingRecord(autoUpdate = false) {
      if (!autoUpdate) this.fetching = true
      const { data } = await Trading.transactionRecord({
        current: this.page,
        pageSize: this.pageSize
      })
      if (data.code !== 200) return this.$message.error(data.message)

      this.recordsTotal = data.data.count
      this.tradeRecords = data.data.rows
      this.fetching = false
    },
    calculateColor(itemId) {
      const items = ['rare-blue', 'rare-purple', 'rare-red', 'rare-orange']
      return items[(itemId & 3) || 0]
    },
    navigateTo(name) {
      name && this.$router.push({ name })
    }
  }
}
</script>

<style scoped>
.info-text {
  width: v-bind(infoTextWidth);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}

:deep(.ant-image) {
  width: 54px;
  margin-right: 10px;
  transition: 0.2s ease;
}

:deep(.ant-image:hover) {
  transform: scale(1.2);
}

.info-item:not(:nth-child(11)) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.ant-spin-blur) {
  border-radius: 0 16px 16px 16px;
}

.item-list-card-body {
  min-height: calc(60vh);
}
</style>