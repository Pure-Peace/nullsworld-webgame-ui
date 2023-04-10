<template>
  <NeedWalletConnect
    @onWalletConnect="init"
    @onAddressChange="init"
    @onWalletDisconnect="onDisconnect"
  >
    <div class="filter-bar px-12 py-10">
      <div class="nulls-count">
        Found
        <span class="font-bold">{{ total }}</span> Nulls
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
          <img src="/meat.png" v-show="isActiveFilter(filter)" />
          <span>{{ filter.text }}</span>
        </div>
      </div>
    </div>

    <a-spin tip="Loading..." :spinning="fetching" delay="50">
      <div class="my-nulls-content px-16 pb-4">
        <NoNulls v-if="nulls?.length === 0" />
        <Nulls
          v-else
          v-for="n in nulls"
          :key="n.pet_id"
          @onButtonClick="handleNullsButton(n)"
          @onItemClick="goNullsDetail(n)"
          :id="n.pet_id"
          :data="n"
        />
      </div>
    </a-spin>
    <div class="flex justify-end px-8 py-8">
      <a-pagination
        @change="updateMyNulls(false)"
        show-quick-jumper
        :defaultPageSize="pageSize"
        v-model:current="page"
        :total="total"
        show-less-items
      />
    </div>
  </NeedWalletConnect>
</template>


<script>
import { MyNulls } from '@/backends'

import NoNulls from '@/components/Items/NoNulls.vue'
import Nulls from '@/components/Items/NullsItem.vue'
import BuyEggs from '@/components/ModalContents/BuyEggs.vue'


export default {
  components: {
    Nulls, BuyEggs, NoNulls
  },
  data() {
    return {
      lastBlockTime: 0,
      page: 1,
      total: 0,
      pageSize: 20,
      fetching: false,
      status: 0,
      statusDict: {
        1: 'combat',
        2: 'ring',
        3: 'rest',
        4: 'idle'
      },
      filters: [
        {
          text: 'All',
          value: 0
        },
        {
          text: 'Combating',
          value: 1
        },
        {
          text: 'Guarding',
          value: 2
        },
        {
          text: 'Resting',
          value: 3
        },
        {
          text: 'Idle',
          value: 4
        },

      ],
      nulls: [],
    }
  },
  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  methods: {
    async updateBlockTime() {
      const { timestamp, status } = await this.wallet.getLatestBlockTimestamp()
      if (status) this.lastBlockTime = timestamp
    },
    onDisconnect() {
      clearInterval(this.updateInterval)
    },
    async init() {
      if (!this.wallet.connected) return
      clearInterval(this.updateInterval)

      this.updateMyNulls()
      this.updateInterval = setInterval(() => {
        this.updateMyNulls(true)
      }, 10000)

      this.updateBlockTime()
      this.updateBlockTimestampInterval = setInterval(() => {
        this.updateBlockTime()
      }, 10000)
    },
    async handleNullsButton(nulls) {
      if (nulls.type === 255) {
        this.paramStore.arenaNullsId = nulls.pet_id
        this.paramStore.arenaNullsType = nulls.type
        this.$root.openGlobalModal('createArena')
        return
      }

      this.$router.push({ name: 'Arena' })
      return
    },
    async updateMyNulls(isAutoUpdate = false) {
      if (!isAutoUpdate) this.fetching = true

      const { data } = await MyNulls.list({
        address: this.wallet.address, status: this.status, current: this.page, pageSize: this.pageSize
      })
      this.fetching = false

      if (data.code !== 200) return this.$message.error(data.message)

      const nulls = data.data.rows
      for (const idx in nulls) {
        const item = nulls[idx]
          item.status_code = item.status
        item.status = this.statusDict[item.status]
      }
      this.total = data.data.count
      this.nulls = nulls

    },
    randColor() {
      const items = ['rare-blue', 'rare-purple', 'rare-red', 'rare-orange']
      return items[Math.floor(Math.random() * items.length)]
    },
    isActiveFilter(filter) {
      return this.status === filter.value
    },
    selectFilter(filter) {
      this.status = filter.value
      this.updateMyNulls()
    },
    fetchData(id) {
      console.log(id)
      this.$refs[id].openInterface()
    },
    goNullsDetail(nulls) {
      this.$router.push({ name: 'NullsDetails', params: { nullsId: nulls.pet_id, petType: nulls.type } })
    }
  }
}
</script>


<style scoped>
.item-list-card-header-button {
  padding: 0 50px;
}

.filter-bar {
  display: flex;
  align-items: center;
  flex-direction: column;
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

.my-nulls-content {
  display: flex;
  flex-wrap: wrap;
}

.nulls-count {
  color: #00367f;
  font-size: 28px;
  margin-right: 24px;
  background-color: #aeceff4d;
  border-radius: 16px;
  padding: 16px 32px;
  font-style: italic;
}
</style>
