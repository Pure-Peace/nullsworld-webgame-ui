<template>
  <header>
    <nav class="relative">
      <div
        id="hight-light-arrow"
        v-show="hightLightArrowLeft"
        :style="`left: ${hightLightArrowLeft}px;`"
      >
        <img src="/hightLight.png" />
      </div>
      <div class="container mx-auto" style="min-width: 1280px !important;">
        <div
          class="flex items-center justify-between flex-col md:flex-row"
          style="min-height: 128px"
        >
          <div class="flex items-end flex-col mt-6 md:mt-0 md:flex-row">
            <div @click="navigateTo({ name: 'Home' })" class="logo flex-shrink-0">
              <img src="/logo-small.png" alt="Nulls-World" />
            </div>
            <div class="md:block">
              <div class="ml-24 flex items-center space-x-4 justify-between">
                <button
                  v-for="item in imageNavItems"
                  :key="`${item.name}-route`"
                  :class="[$route.name === item.name ? 'current-route' : '', 'nav-button', 'with-font', 'nav-pop-button']"
                  @click="navigateTo(item)"
                >
                  <img class="nav-button-image" :src="`/${item.icon}@1x.png`" />
                  <span class="px-3" :ref="`${item.name}-route`">{{ item.name }}</span>
                </button>

                <a-dropdown placement="bottomCenter">
                  <div
                    :class="[$route.path?.includes('profile') && $route.name !== 'MyEggs' ? 'current-route' : '', 'me']"
                    @click="$router.push({ name: 'MyNulls' })"
                  >
                    <!-- <img class="avatar" src="/home@1x.png" /> -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-9 w-9"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      class="username"
                      ref="me-route"
                    >{{ wallet.cuttedAddress || 'No Wallet Connect' }}</span>
                    <!-- <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style="height: 24px; margin-left: 2px"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                    </svg>-->
                  </div>
                  <template #overlay>
                    <custom-dropdown>
                      <li v-for="item in menuItems" :key="item" @click="navigateTo(item)">
                        <div>{{ item.text }}</div>
                      </li>
                    </custom-dropdown>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </div>
          <div class="md:block">
            <div class="ml-4 mt-5 flex items-center">
              <button
                @click="navigateTo({ name: 'MyEggs' })"
                :class="[$route.name === 'MyEggs' ? 'current-route' : '', 'nav-button-vertical', 'nav-pop-button']"
              >
                <img class="nav-button-image" src="/eggs-kira.png" />
                <span class="px-2" ref="MyEggs-route">EGGS</span>
              </button>
              <button
                @click="$root.openGlobalModal('help')"
                class="nav-button-vertical nav-pop-button"
              >
                <img class="nav-button-image" src="/tips.png" />
                <span class="px-2">HELP</span>
              </button>
              <div class="connect-wallet">
                <color-button
                  @click="$root.openGlobalModal('walletConnect')"
                  style="width: 145px; font-size: 12px;"
                  :buttonStyle="wallet.connected ? wallet.isCorrectNetwork ? 'yellow' : 'red' : 'orange'"
                >{{ wallet.connected ? wallet.isCorrectNetwork ? 'Connected' : 'Wrong Network' : 'Connect to Wallet' }}</color-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import BuyEggs from '@/components/ModalContents/BuyEggs.vue'
import Help from '@/components/ModalContents/Help.vue'
import WalletConnect from '@/components/ModalContents/WalletConnect.vue'
import CustomModal from '@/components/Common/CustomModal.vue'

export default {
  components: {
    BuyEggs, Help, WalletConnect, CustomModal
  },
  watch: {
    '$route.name': function (newVal) {
      if (this.menuItems.find(i => i.name === newVal)) newVal = 'me'
      const dom = this.$refs[`${newVal}-route`]
      if (dom) this.routeDom = dom
      this.updateArrowPosition()
    }
  },
  created() {
    window.addEventListener('resize', this.updateArrowPosition)
  },
  data() {
    return {
      routeDom: undefined,
      hightLightArrowLeft: undefined,
      imageNavItems: [
        {
          name: 'Home',
          icon: 'home'
        },
        {
          name: 'Arena',
          icon: 'ring'
        },
        {
          name: 'Market',
          icon: 'market'
        }
      ],
      profile: ['Your Profile', 'Settings', 'Sign out'],
      menuItems: [
        {
          text: 'My Nulls',
          name: 'MyNulls'
        },
        {
          text: 'Combat Records',
          name: 'MyCombatRecords'
        },
        {
          text: 'Transaction History',
          name: 'MyTransactionHistory'
        }
      ],
    }
  },
  methods: {
    navigateTo(navItem) {
      navItem &&
        this.$router.push({ name: navItem.name, params: navItem.defaultParams || {} })
    },
    updateArrowPosition() {
      if (this.routeDom) {
        this.$nextTick(() => {
          const { left } = this.routeDom.getBoundingClientRect()
          this.hightLightArrowLeft = this.$route.name === 'MyEggs' ? left + 8 : left + 16
        })
      }
    }
  }
}
</script>

<style scoped>
.current-route {
  background-color: #fef9e74d;
  filter: brightness(1.05);
  transform: scale(1.1);
  box-shadow: 0 0 30px #fef9e74d;
}

.nav-pop-button {
  transition: 0.2s ease; /* 0.2s cubic-bezier(0.19, 1, 0.22, 1); */
  border-radius: 20px;
}

.nav-button {
  padding: 6px 6px 6px 13px;
  font-size: 18px;
  font-weight: 400;
  color: #ffbb15;
  line-height: 26px;
  text-shadow: 2px 2px 1px black;
  user-select: none;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-pop-button:hover {
  transform: scale(1.2);
  filter: brightness(1.1);
  /* background-color: #ffffff33; */
}

.nav-pop-button:active {
  /* transform: scale(1.1); */
  transform: translateY(5px);
  filter: brightness(0.9);
}

.logo {
  transition: 0.2s ease;
  user-select: none;
  cursor: pointer;
  width: 141px;
}

.logo:hover {
  transform: scale(1.1);
  filter: brightness(1.05);
}

.logo:active {
  transform: scale(1);
  filter: brightness(0.95);
}

.logo img {
  height: 63px;
}

.with-font {
  font-family: LuckiestGuy-Regular, LuckiestGuy;
}

.nav-button-vertical {
  padding: 10px 18px;
  font-size: 18x;
  font-family: LuckiestGuy-Regular, LuckiestGuy;
  font-weight: 400;
  color: #ffbb15;
  text-shadow: 2px 2px 1px black;
  user-select: none;
  flex-direction: column;
}

.nav-button-vertical .nav-button-image {
  height: 33px;
}

.nav-button-image {
  height: 33px;
  user-select: none;
}

.me {
  overflow: hidden;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  color: #00367f;
  cursor: pointer;
  user-select: none;
  transition: 0.2s ease;
  padding: 8px;
  border-radius: 20px;
}

.me:hover {
  text-shadow: 0 2px 8px rgb(0 0 0 / 35%);
  transform: scale(1.1);
  /* background-color: #ffffff33; */
}

.me:active {
  /* transform: scale(0.95); */
  transform: translateY(5px);
}

.avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  user-select: none;
}

.username {
  display: inline-block;
  min-width: 125px;
  margin-left: 8px;
  font-size: 14px;
  font-weight: bold;
}

.connect-wallet {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 28px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

#hight-light-arrow {
  position: absolute;
  left: 0;
  top: 10px;
  transition: 0.2s ease;
  transform: translateZ(0);
}

#hight-light-arrow img {
  transform: rotate(180deg);
  width: 32px;
}
</style>