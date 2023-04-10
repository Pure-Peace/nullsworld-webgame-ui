<template>
  <div>
    <Notice />
    <div class="w-full flex-1">
      <div class="item-list-card mt-6">
        <div class="item-list-card-body">
          <div class="filter-bar px-12 py-10">
            <div class="market-count">
              Total
              <span class="font-bold">{{ total }}</span> Commodities
            </div>
            <div class="flex items-center">
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
            <div class="deal-content">
              <empty v-show="trades?.length < 1" />
              <CommodityItem
                v-for="(tradeData, idx) in trades"
                :key="tradeData.id"
                :data="tradeData"
                @onItemPurchased="onItemPurchased(idx)"
              />
            </div>
          </a-spin>

          <div class="flex justify-end px-8 py-8">
            <a-pagination
              @change="fetchTradList(false)"
              show-quick-jumper
              v-model:current="page"
              :total="total"
              show-less-items
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Notice from '@/components/Common/NoticeBar.vue'
import { Trading } from '@/backends'
import empty from '@/components/Common/EmptyStatus.vue'
import CommodityItem from '@/components/Items/CommodityItem.vue'


export default {
  components: {
    Notice, empty, CommodityItem
  },
  data() {
    return {
      updateInterval: -1,
      marketContract: undefined,
      approving: false,
      purchasing: false,
      fetching: true,
      usdtDecimals: 6,
      selectedFilter: 0,
      filters: [
        {
          text: 'All',
          value: 0
        },
        {
          text: 'Guardians',
          value: 1
        },
        {
          text: 'Challenger',
          value: 2
        }
      ],
      total: 1,
      page: 1,
      trades: []
    }
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  async created() {
    this.fetchTradList()
    this.updateInterval = setInterval(() => {
      this.fetchTradList(true)
    }, 10000)
  },
  methods: {
    async onItemPurchased(idx) {
      /* this.trades.splice(idx, 1) */
      await this.fetchTradList()
    },
    async fetchTradList(autoUpdate = false) {
      if (!autoUpdate) this.fetching = true
      const { data } = await Trading.marketPage({
        current: this.current,
        pageSize: this.pageSize,
        type: this.selectedFilter
      })

      this.fetching = false
      if (data.code != 200) return this.$message.error(data.message)

      this.total = data.data?.count
      this.trades = data.data?.row?.sort((a, b) => b.id - a.id)
    },
    isActiveFilter(filter) {
      return this.selectedFilter === filter.value
    },
    selectFilter(filter) {
      this.selectedFilter = filter.value
      this.fetchTradList()
    }
  }

}
</script>

<style scoped>
.item-list-card {
  height: 100%;
  width: 100%;
}

.deal-content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
}

.item-list-card-body {
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 56px);
  border-radius: 16px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.market-count {
  font-size: 18px;
  margin-right: 24px;
  background-color: #aeceff4d;
  border-radius: 16px;
  padding: 8px 16px;
  font-style: italic;
}
</style>