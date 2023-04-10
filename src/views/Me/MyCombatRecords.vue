<template>
  <NeedWalletConnect
    @onWalletConnect="init"
    @onAddressChange="init"
    @onWalletDisconnect="onDisconnect"
  >
    <div class="filter-bar px-12 py-10">
      <div class="combat-records-count">
        <img src="/ring.png" style="height: 34px;" class="mr-2" />
        <span class="font-bold mr-2">{{ total }}</span> combats have been performed
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
      <empty class="mt-16" v-show="combatRecords?.length < 1" />
      <div>
        <div
          class="info-item info-item-big justify-between items-center"
          v-for="record in combatRecords"
          :key="record.id"
        >
          <div class="flex items-center">
            <div class="flex items-center">
              <a-image class="ring-image" :src="`/gamebg${calcArenaImage(record.item_id)}.jpg`" />
              <div>
                <div :class="`info-block-num ${calcColor(record.item_id)}`">#{{ record.item_id }}</div>
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
            <div class="ml-10 w-36">
              <div :class="[combatColor(record), 'info-status']">{{ combatStatus(record) }}</div>
            </div>
            <div class="info-vs ml-8">
              <div class="player items-end">
                <div>
                  <span
                    :class="[calcColor(record.challenger_pet_id), 'nulls-id']"
                  >#{{ record.challenger_pet_id }}</span>
                  <span
                    :class="imChallenger(record) ? 'isMe' : ''"
                  >{{ imChallenger(record) ? 'You' : 'Challenger' }}</span>
                </div>
                <a-tooltip>
                  <template #title>
                    Challenger address:
                    <div class="font-bold">{{ record.challenger_address }}</div>
                  </template>
                  <a
                    :href="accountExplorer(record.challenger_address)"
                    target="_blank"
                    class="address"
                  >({{ cutEthAddress(record.challenger_address, 6) }})</a>
                </a-tooltip>
              </div>
              <div class="vs-icon">VS</div>
              <div class="player items-start">
                <div>
                  <span
                    :class="imGuardians(record) ? 'isMe' : ''"
                  >{{ imGuardians(record) ? 'You' : 'Arena' }}</span>
                  <span
                    :class="[calcColor(record.ring_pet_id), 'nulls-id']"
                  >#{{ record.ring_pet_id }}</span>
                </div>
                <a-tooltip>
                  <template #title>
                    Arena address:
                    <div class="font-bold">{{ record.ring_address }}</div>
                  </template>
                  <a
                    :href="accountExplorer(record.ring_address)"
                    target="_blank"
                    class="address"
                  >({{ cutEthAddress(record.ring_address, 6) }})</a>
                </a-tooltip>
              </div>
            </div>
            <a-tooltip>
              <template #title>
                {{ record.token_name }} Contract:
                <div class="font-bold">{{ record.token }}</div>
              </template>
              <a
                :class="[calcImWin(record) ? 'color-green' : 'color-red', 'bonus ml-14']"
                target="_blank"
                :href="accountExplorer(record.token)"
              >
                {{ calcImWin(record) ? '+' : '-' }}{{ removeDecimal(calcMyBonus(record), record.token_precision) }}
                {{ record.token_name }}
              </a>
            </a-tooltip>
          </div>
          <div class="flex items-center justify-between w-52">
            <div>
              <img
                style="height: 48px; width: 87px"
                :src="calcImWin(record) ? '/victory.png' : '/defeat.png'"
              />
            </div>
            <div>
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
                  <button class="info-item-button pop-button">
                    <img src="/button1.png" />
                  </button>
                </a>
              </a-tooltip>
            </div>
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
import { Ring } from '@/backends'
import { formatNumber, calcArenaImage, calcColor, formatDate, removeDecimal, cutEthAddress, accountExplorer, txExplorer } from '@/utils/common'

import empty from '@/components/Common/EmptyStatus.vue'

const recordAddrs = (record) => {
  return {
    cAddr: record.challenger_address.toLowerCase(),
    gAddr: record.ring_address.toLowerCase()
  }
}

export default {
  components: {
    empty
  },
  data() {
    return {
      formatNumber,
      calcArenaImage,
      calcColor,
      formatDate,
      removeDecimal,
      cutEthAddress,
      accountExplorer,
      txExplorer,
      total: 0,
      pageSize: 10,
      page: 1,
      updateDataInterval: -1,
      fetching: false,
      combatRecords: [],
      selectedFilter: 0,
      filters: [
        {
          text: 'All',
          value: 0
        },
        {
          text: 'My Arena',
          value: 1
        },
        {
          text: 'My Challenge',
          value: 2
        }
      ],
    }
  },
  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateDataInterval)
  },
  methods: {
    onDisconnect() {
      clearInterval(this.updateDataInterval)
    },
    async init() {
      if (!this.wallet.connected) return
      clearInterval(this.updateDataInterval)

      this.fetchData()
      this.updateDataInterval = setInterval(() => {
        this.fetchData(true)
      }, 8000)
    },
    async fetchData(isAutoUpdate = false) {
      if (!isAutoUpdate) this.fetching = true
      const { data } = await Ring.myCombatResults({
        address: this.wallet.address,
        type: this.selectedFilter,
        pageSize: this.pageSize,
        current: this.page
      })
      this.fetching = false
      if (data.code != 200) return this.$message.error(data.message)
      this.total = data.data.count
      this.combatRecords = data.data.rows

    },
    isActiveFilter(filter) {
      return this.selectedFilter === filter.value
    },
    selectFilter(filter) {
      this.selectedFilter = filter.value
      this.fetchData()
    },
    combatColor(record) {
      const { cAddr, gAddr } = recordAddrs(record)
      if (cAddr === gAddr && this.wallet.address === cAddr) return 'color-orange'
      return cAddr === this.wallet.address ? 'color-green' : 'color-red'
    },
    combatStatus(record) {
      const { cAddr, gAddr } = recordAddrs(record)
      if (cAddr === gAddr && this.wallet.address === cAddr) return 'Self Challenge'
      return cAddr === this.wallet.address ? 'Challenge' : 'Guarding'
    },
    calcImWin(record) {
      const { cAddr, gAddr } = recordAddrs(record)
      if (cAddr === gAddr && this.wallet.address === cAddr) return record.isWin !== 1
      if (gAddr === this.wallet.address) return record.isWin === 1
      return record.isWin !== 1
    },
    calcMyBonus(record) {
      const cAddr = record.challenger_address.toLowerCase()
      const imWin = this.calcImWin(record)
      if (cAddr === this.wallet.address) return imWin ? record.value : record.tickets
      return imWin ? 0 : record.value
    },
    imGuardians(record) {
      return record.ring_address.toLowerCase() === this.wallet.address
    },
    imChallenger(record) {
      return record.challenger_address.toLowerCase() === this.wallet.address
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

.bonus {
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

.color-orange {
  color: #ff7c43;
  border-color: #ff7c43;
}

.info-status {
  display: inline-block;
  border-radius: 10px;
  border: 2px solid;
  padding: 4px 10px;
}

.info-vs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  width: 400px;
  font-weight: 500;
}

.vs-icon {
  padding: 2px 4px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #ffffff;
  height: 24px;
  width: 26px;
  border-radius: 6px;
  background: #6e98fa;
  box-shadow: 0 1px 1px #4273c8;
}

.player {
  display: flex;
  flex-direction: column;
  color: #111111;
  padding: 0 20px;
}

.paging-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.combat-records-count {
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

:deep(.ant-image) {
  width: 90px;
  margin-right: 12px;
  transition: 0.2s ease;
}

:deep(.ant-image:hover) {
  transform: scale(1.1);
}

:deep(.ant-image-img) {
  border-radius: 6px;
}

.nulls-id {
  font-size: 12px;
  color: #ffffff;
  border-radius: 12px;
  padding: 2px 7px;
  margin: 0 10px;
}

.address {
  padding: 4px 0;
  font-size: 12px;
}

.isMe {
  color: #01ba96;
  font-weight: bold;
}
</style>