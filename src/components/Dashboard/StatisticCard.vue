<template>
  <div class="card">
    <div class="card-header">
      <button
        @click="handleSwitchTab(tab.key)"
        :class="`card-header-button text-base md:text-base xl:text-xl ${tab.key === currentTab ? 'card-header-button-active' : ''
        }`"
        v-for="tab in cardTabs"
        :key="tab.key"
      >
        <span class="card-header-button-text">{{ tab.title }}</span>
      </button>
    </div>
    <a-spin tip="Loading..." :spinning="fetching" delay="50">
      <div
        class="card-body flex justify-around items-start flex-col sm:flex-row md:flex-row p-1 sm:p-5 md:p-5"
      >
        <div class="card-info-item p-3 md:p-5">
          <div class="card-info-icon px-5">
            <img src="/diamond-box.png" class="h-14 w-14 sm:h-20 sm:w-20 md:h-20 md:w-20" />
          </div>
          <div>
            <div class="card-info-title">Arena Challenge</div>
            <div class="card-info-amount">
              {{ numberFmt(data?.ring_total) }}
              <span>USDT</span>
            </div>
            <div class="card-info-amount-convert">≈${{ numberFmt(data?.ring_total) }}</div>
          </div>
        </div>
        <div class="card-info-item p-3 md:p-5">
          <div class="card-info-icon px-5">
            <img src="/bag1.png" class="h-14 w-14 sm:h-20 sm:w-20 md:h-20 md:w-20" />
          </div>
          <div>
            <div class="card-info-title">Pet Sales</div>
            <div class="card-info-amount">
              {{ numberFmt(data?.sell_total) }}
              <span>USDT</span>
            </div>
            <div class="card-info-amount-convert">≈${{ numberFmt(data?.sell_total) }}</div>
          </div>
        </div>
        <div class="card-info-item p-3 md:p-5">
          <div class="card-info-icon px-5">
            <img src="/bag2.png" class="h-14 w-14 sm:h-20 sm:w-20 md:h-20 md:w-20" />
          </div>
          <div>
            <div class="card-info-title">Egg Sales</div>
            <div class="card-info-amount">
              {{ numberFmt(data?.egg_total) }}
              <span>USDT</span>
            </div>
            <div class="card-info-amount-convert">≈${{ numberFmt(data?.egg_total) }}</div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { removeDecimal, formatNumber } from '@/utils/common'
import { Dashboard } from '@/backends'


export default {
  data() {
    return {
      removeDecimal,
      formatNumber,
      cardTabs: [
        {
          title: 'Last 24h',
          key: 1
        },
        {
          title: '7 days',
          key: 2
        },
        {
          title: '30 days',
          key: 3
        }
      ],
      decimal: 6,
      currentTab: 1,
      fetching: true,
      data: {},
      updateInterval: -1
    }
  },
  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  methods: {
    async init() {
      clearInterval(this.updateInterval)
      await this.fetchData()
      this.updateInterval = setInterval(() => {
        this.fetchData(true)
      }, 10000)
    },
    async fetchData(autoUpdate = false) {
      if (!autoUpdate) this.fetching = true
      const { data } = await Dashboard.statistic({ type: this.currentTab })
      this.data = data.data
      this.fetching = false
    },
    numberFmt(digital) {
      return digital ? formatNumber(Math.round(removeDecimal(digital, this.decimal))) : 0
    },
    handleSwitchTab(key) {
      this.currentTab = key
      this.fetchData()
    }
  },
}

</script>

<style scoped>
.card {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px) brightness(1.1);
  box-shadow: 0 0 100px #ffffff inset, 0 0 30px #ffffff66;
  min-height: 207px;
}

.card-header {
  display: flex;
  height: 50px;
}

.card-header-button-text {
  font-size: 18px;
}

.card-header-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.2s ease;
  width: 158px;
  height: 100%;
  border-radius: 16px 0 16px 0;
  color: #666666;
}

.card-header-button-active {
  width: 169px;
  background-color: #ffffff00;
  background-image: linear-gradient(
    120deg,
    #ffffff1a 13%,
    #eaeafde6 52%,
    #abc9fe99 100%
  );
  color: #00367f;
}

.card-body {
}

.card,
.card-header,
.card-body {
  border-radius: 16px;
}

.card-info-item {
  display: flex;
  align-items: center;
}

.card-info-title {
  font-size: 16px;
  font-weight: 500;
  color: #666666;
}

.card-info-amount {
  font-size: 20px;
  font-weight: 500;
  color: #00367f;
}

.card-info-amount span {
  font-size: 16px;
}

.card-info-amount-convert {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
}
</style>