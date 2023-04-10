<template>
  <div class="w-full flex-1">
    <Notice />
    <div class="item-list-card mt-6 relative">
      <div class="incombat-box">
        <div
          :class="[showIncombatBox ? 'rorate-incombat-button' : '', 'incombat-button']"
          @click="showIncombatBox = !showIncombatBox"
        >
          <img class="incombat-button-image" src="/ring.png" />
          <div
            :class="[!combatingArena.length || showIncombatBox ? 'hide-bulb' : '', 'incombat-button-bulb']"
          >{{ combatingArena.length }}</div>
        </div>
        <div :class="[showIncombatBox ? 'show-incombat-content' : '', 'incombat-content']">
          <div class="incombat-content-raw">
            <div class="incombat-title">
              Combating
              <span style="font-size: 12px;">({{ combatingArena.length }})</span>
            </div>
            <div class="incombat-arena-box">
              <empty style="margin-top: 20px;" v-show="combatingArena?.length < 1" />
              <InCombatArenaItem
                v-for="ca in combatingArena"
                :key="`${ca.item_id}-combating-arena-item`"
                :data="ca"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="item-list-card-body">
        <div class="options-bar filter-bar px-12 py-10">
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
              <span>{{ filter?.text }}</span>
            </div>
            <a-dropdown :trigger="['click']" placement="bottomCenter">
              <div class="dropdown-filter" @click.prevent style="text-shadow: none">
                <span class="dropdown-text">{{ selectedFilterText2 }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="height: 16px; margin-left: 5px"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <template #overlay>
                <custom-dropdown>
                  <li v-for="f in filtersL2" :key="f" @click="selectFilterL2(f)">
                    <div>{{ f.text }}</div>
                  </li>
                </custom-dropdown>
              </template>
            </a-dropdown>
          </div>
          <div class="flex items-center">
            <color-button
              @click="$message.warn('Quick Combat are currently not aviliable.')"
              buttonStyle="red"
            >Quick Combat</color-button>
            <color-button
              @click="$root.openGlobalModal('selectNullsArena')"
              buttonStyle="blue"
            >Create Arena</color-button>
          </div>
        </div>
        <div class="flex items-center justify-between px-12 py-10 mt-5">
          <div class="flex items-center mr-2">
            <div class="arena-count">
              Total
              <span class="font-bold">{{ total }}</span> Arenas
            </div>
            <input
              v-model="searchInput"
              type="text"
              class="search-input focus:outline-none focus:shadow-outline"
              placeholder="Enter Arena id to search"
            />
            <color-button @click="handleSearch" :disabled="fetching">Search</color-button>
          </div>
          <div style="background-color: #aeceff4d; padding: 8px 16px; border-radius: 16px;">
            <custom-checkbox v-model:checked="paramStore.autoSelectNulls">Auto nulls selection</custom-checkbox>
            <custom-checkbox v-model:checked="hideInCombat">Hide already in combat</custom-checkbox>
          </div>
        </div>
        <a-spin tip="Loading..." :spinning="fetching" delay="50">
          <div class="arena-list px-12 mt-5">
            <empty v-show="arenaList?.length < 1" />
            <ArenaItem
              v-for="(a, idx) in arenaList"
              :key="`${a.item_id}-arena-item`"
              :data="a"
              @onWin="onWin($event, a, idx)"
              @onLose="onLose($event, a, idx)"
              @combatStart="combatStart($event, a, idx)"
              @combatEnd="combatEnd($event, a, idx)"
              @combatApproved="combatApproved($event, a, idx)"
              @combatApproving="combatApproving($event, a, idx)"
              @combatFailed="combatFailed($event, a, idx)"
              :hideInCombat="hideInCombat"
              :ended="isEnded"
            />
          </div>
        </a-spin>
        <div class="paging-bar px-10 pb-10 pt-4">
          <a-pagination
            @change="fetchRingList(false)"
            show-quick-jumper
            v-model:current="currentPage"
            :total="total"
            show-less-items
          />
        </div>
      </div>
      <div
        :class="[openBattleConsole ? 'battle-console-box-unfold' : 'battle-console-box-fold', 'battle-console-box']"
      >
        <div class="battle-console-head" @click="openBattleConsole = !openBattleConsole">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              :class="openBattleConsole ? 'rotate-battle-console-icon' : '', 'battle-console-icon'"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 11l7-7 7 7M5 19l7-7 7 7"
              />
            </svg>
            <div class="px-4">Battle Console</div>
          </div>
          <div class="battle-console-bulb" v-show="battleRecords.length">{{ battleRecords.length }}</div>
        </div>
        <div class="battle-console-content">
          <empty style="margin-top: 20px;" v-show="battleRecords?.length < 1" />
          <div
            v-for="(rec, idx) in battleRecords.sort((a, b) => b.time - a.time)"
            :key="`battle-record-${idx}`"
            class="battle-record-line"
          >
            <div class="battle-record-id" style="background-color: orange;">{{ rec?.id }}</div>
            <div
              :class="[calcColor(rec?.arena?.item_id), 'battle-record-id']"
              style="min-width: 100px;"
            >Arena #{{ rec?.arena?.item_id }}</div>
            <div
              :class="[eventColor(rec?.event), 'battle-record-id']"
              style="min-width: 125px;"
            >{{ rec?.event }}</div>
            <div class="battle-record-time">{{ formatDate(rec.time, { fromNow: true }) }}</div>
            <div class="flex" v-if="rec.event === 'combatStart'">
              Upcoming challenge with
              <div
                :class="[calcColor(rec?.ev?.petId), 'battle-record-id mx-2']"
              >nulls #{{ rec.ev.petId }}</div>, tickets:
              <div class="font-bold px-2">
                {{
                  formatNumber(removeDecimal(rec.arena.tickets, rec.arena.token_precision))
                }} {{ rec.arena.token_name }}
              </div>, please approve.
            </div>
            <div class="flex" v-else-if="rec.event === 'combatApproving'">
              Waiting for blockchain results.
              <div class="font-bold px-2">
                TX:
                <a target="_blank" :href="txExplorer(rec.ev.pkTx)">{{ rec.ev.pkTx }}</a>
              </div>
            </div>
            <div class="flex" v-else-if="rec.event === 'combatApproved'">
              The battle has begun!
            </div>
            <div class="flex" v-else-if="rec.event === 'combatFailed'">
              Combat failed, error message:
              <div class="font-bold px-2">{{ rec.ev.result }}</div>
            </div>
            <div class="flex" v-else-if="rec.event === 'lose'">
              Combat Failed!
            </div>
            <div class="flex" v-else-if="rec.event === 'lose'">
              You win the battle!
            </div>
            <div class="flex" v-else>{{ rec }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { Ring } from '@/backends'
import { formatNumber, removeDecimal, formatDate, calcColor, txExplorer } from '@/utils/common'

import Notice from '@/components/Common/NoticeBar.vue'
import empty from '@/components/Common/EmptyStatus.vue'
import CustomCheckbox from '@/components/Common/CustomCheckbox.vue'

import ArenaItem from '@/components/Items/ArenaItem.vue'
import InCombatArenaItem from '@/components/Items/InCombatArenaItem.vue'


export default {
  components: {
    empty, Notice, CustomCheckbox, ArenaItem, InCombatArenaItem
  },
  data() {
    return {
      showIncombatBox: false,
      arenaId: undefined,
      arenaTokenAddress: undefined,
      showModal: false,
      formatNumber, removeDecimal, formatDate, calcColor, txExplorer,
      currentPage: 1,
      total: 0,
      pageSize: 12,
      hideInCombat: false,
      searchInput: undefined,
      fetching: true,
      selectedFilter: 1,
      updateInterval: -1,
      openBattleConsole: false,
      filters: [
        {
          text: 'Challengable',
          value: 1
        },
        {
          text: 'Ended',
          value: 3
        }
      ],
      selectedFiltersL2: 2,
      filtersL2: [
        {
          text: 'Top Prize pool',
          key: 0
        },
        {
          text: 'Minimum Prize pool',
          key: 1
        },
        {
          text: 'Latest Arena',
          key: 2
        },
        {
          text: 'Top multiplier',
          key: 3
        }
      ],
      battleRecords: [],
      arenaList: [],
      combatingArena: []
    }
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  async created() {
    this.fetchRingList()
    this.updateInterval = setInterval(() => {
      this.fetchRingList(true)
    }, 5000)
  },
  watch: {
    selectedFilter() {
      this.currentPage = 1
      this.fetchRingList()
    },
    selectedFiltersL2() {
      this.currentPage = 1
      this.fetchRingList()
    }
  },
  methods: {
    async fetchRingList(autoUpdate = false) {
      if (!autoUpdate) this.fetching = true
      const { data } = await Ring.findPage({
        status: this.selectedFilter,
        sort: this.selectedFiltersL2,
        current: this.currentPage,
        pageSize: this.pageSize,
        number: this.searchInput
      })
      this.fetching = false

      if (data.code != 200) return this.$message.error(data.message)
      this.total = data.data.count
      this.arenaList = data.data.rows
    },
    isActiveFilter(filter) {
      return this.selectedFilter === filter?.value
    },
    selectFilter(filter) {
      this.selectedFilter = filter?.value
    },
    selectFilterL2(filter) {
      this.selectedFiltersL2 = filter?.key
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchRingList()
    },
    handleCombat(a) {
      this.arenaId = a.item_id
      this.arenaTokenAddress = a.token
      this.showModal = true
    },
    onWin(ev, arena, idx) {
      this.newBattleRecord('win', ev, arena)
      this.arenaList.splice(idx, 1)
    },
    onLose(ev, arena, idx) {
      this.newBattleRecord('lose', ev, arena)
    },
    combatStart(ev, arena, idx) {
      this.newBattleRecord('combatStart', ev, arena)
      this.combatingArena.push(arena)
    },
    combatEnd(ev, arena, idx) {
      const index = this.combatingArena.findIndex(i => i.item_id === arena.item_id)
      if (index !== -1) {
        this.combatingArena.splice(index, 1)
      }
    },
    combatApproving(ev, arena, idx) {
      this.newBattleRecord('combatApproving', ev, arena)
    },
    combatApproved(ev, arena, idx) {
      this.newBattleRecord('combatApproved', ev, arena)
    },
    combatFailed(ev, arena, idx) {
      this.newBattleRecord('combatFailed', ev, arena)
    },
    newBattleRecord(event, ev, arena) {
      this.battleRecords.push({
        id: this.battleRecords.length + 1,
        event, arena, ev, time: new Date()
      })
    },
    eventColor(event) {
      const dict = {
        combatStart: 'rare-blue',
        combatApproving: 'rare-grey',
        combatApproved: 'rare-purple',
        lose: 'rare-red',
        win: 'rare-green',
        combatFailed: 'rare-orange'
      }
      return dict[event] || 'rare-grey'
    }
  },
  computed: {
    selectedFilterText2() {
      return this.filtersL2?.filter && this.filtersL2.filter((f) => f.key === this.selectedFiltersL2)[0]?.text
    },
    walletAddress() {
      return this.wallet?.address
    },
    isEnded() {
      return this.selectedFilter === 3
    }
  }
}
</script>

<style scoped>
.color-button {
  margin: 0 10px;
}

.item-list-card {
  height: 100%;
  width: 100%;
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

.menu-item-active {
  background-color: #ffffff00;
  background-image: linear-gradient(
    120deg,
    #ffffff1a 13%,
    #eaeafde6 52%,
    #abc9fe99 100%
  );
  color: #00367f;
}

.dropdown-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 22px;
  font-size: 16px;
  font-weight: 400;
  color: #00367f;
  line-height: 26px;
  user-select: none;
  transition: 0.2s ease;
  border-radius: 8px;
  border: 2px solid #00367f;
  margin-right: 35px;
  cursor: pointer;
}

.dropdown-text {
  padding: 0 5px;
  width: 126px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.dropdown-filter:hover {
  background-color: #aeceff4d;
}

.dropdown-filter:active {
  transform: scale(0.9);
  background-color: #aeceff4d;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input {
  text-align: center;
  padding: 5px 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 2px solid #00367f;
  background: transparent;
  width: 310px;
  margin-right: 20px;
}

.arena-list {
  display: flex;
  flex-wrap: wrap;
}

.paging-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.arena-count {
  font-size: 18px;
  margin-right: 24px;
  background-color: #aeceff4d;
  border-radius: 16px;
  padding: 8px 16px;
  font-style: italic;
}

.options-bar {
  border-bottom: 3px dashed #aeceff4d;
}

.incombat-box {
  z-index: 10;
  position: fixed;
  margin-top: 26px;
  margin-left: 1280px;
}

.incombat-button {
  position: absolute;
  cursor: pointer;
  user-select: none;
  padding: 10px;
  border-radius: 0 12px 12px 0;
  border-width: 2px 2px 2px 0;
  border-style: solid;
  transition: 0.4s ease;
  height: 56px;
  width: 54px;
  z-index: 20;
  animation: breathLight 2s infinite linear;
}

@keyframes breathLight {
  0% {
    border-color: #fff67399;
    box-shadow: 0 0 30px #fff673f6;
    background-color: #fff67399;
  }

  50% {
    border-color: #fff67333;
    box-shadow: 0 0 30px #fff67333;
    background-color: #fff67333;
  }

  100% {
    border-color: #fff67399;
    box-shadow: 0 0 30px #fff673f6;
    background-color: #fff67399;
  }
}

.incombat-button:hover {
  border-color: yellow !important;
  box-shadow: 0 0 30px yellow !important;
  filter: brightness(1.1);
}

.incombat-button:active {
  filter: brightness(0.8);
}

.incombat-button:active .incombat-button-image {
  transform: scale(0.9);
}

.incombat-button-image {
  height: 32px;
  width: 32px;
  transition: 0.2s ease;
}

.rorate-incombat-button {
  width: 190px;
  border-bottom-right-radius: 0;
}

.rorate-incombat-button .incombat-button-image {
  transform: rotate(45deg);
}

.incombat-content {
  background-color: #ffffff33;
  width: 0px;
  height: 550px;
  position: absolute;
  z-index: 15;
  top: 0;
  left: 0;
  opacity: 0;
  transition: 0.3s ease;
  overflow: hidden;
  border-radius: 0 16px 16px 0;
  box-shadow: 20px 0 20px #0000001a;
  backdrop-filter: blur(4px);
}

.show-incombat-content {
  width: 190px;
  opacity: 1;
}

.incombat-title {
  user-select: none;
  font-weight: bold;
  line-height: 56px;
  padding-left: 34px;
  text-align: center;
  vertical-align: middle;
  color: #00367f;
  font-size: 14px;
}

.incombat-content-raw {
  width: 190px;
}

.incombat-arena-box {
  overflow-y: scroll;
  height: calc(550px - 56px);
  padding: 8px;
}

.incombat-button-bulb {
  position: absolute;
  right: -15px;
  top: -10px;
  border-radius: 15px;
  padding: 2px 6px;
  background-color: red;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  transition: 0.2s ease;
  overflow: hidden;
  opacity: 0.9;
}

.hide-bulb {
  opacity: 0;
}

.battle-console-box {
  position: fixed;
  bottom: 0;
  width: 1280px;
  padding: 10px 20px;
  z-index: 25;
  background-color: #ffffffb3;
  backdrop-filter: blur(4px);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 0 30px #00000033;
  transition: 0.4s ease;
  /* border-width: 2px 2px 0 2px;
  border-style: solid;
  border-color: #000000; */
}

.battle-console-box-fold {
  height: 50px;
}

.battle-console-box-unfold {
  height: 260px;
}

.battle-console-head {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  text-shadow: 0 0 12px #00000033;
  transition: 0.2s ease;
}

.battle-console-head:hover {
  text-shadow: 0 0 22px #000000;
}

.battle-console-icon {
  transition: transform 0.4s ease;
}

.rotate-battle-console-icon {
  transform: rotate(180deg);
}

.battle-console-bulb {
  background-color: red;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  border-radius: 16px;
  padding: 2px 8px;
}

.battle-console-content {
  margin: 10px 8px;
  overflow: auto;
  height: calc(260px - 70px);
}

.battle-record-line {
  display: flex;
  padding: 2px 0;
  text-shadow: 0 0 12px #00000066;
}

.battle-record-id {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  border-radius: 12px;
  padding: 0px 10px;
  margin-right: 5px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
}

.rare-green {
  background-color: #01ba96;
}

.rare-grey {
  background-color: #99a3a4;
}

.battle-record-time {
  padding: 0 6px;
  font-weight: bold;
  min-width: 80px;
}
</style>