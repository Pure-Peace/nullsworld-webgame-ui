<template>
  <div class="arena-container">
    <div class="arena-title">Create Arena</div>
    <div class="arena-introduce">Select a nulls to Create the Arena</div>
    <NeedWalletConnect
      @onWalletConnect="init"
      @onAddressChange="init"
      @onWalletDisconnect="onDisconnect"
    >
      <a-spin tip="Loading..." :spinning="fetching || approving || combating">
        <div class="my-nulls-content py-12">
          <NoNulls v-if="!wallet.connected || noNulls" />
          <div
            v-else
            v-for="n in nulls"
            :class="[n.pet_id === myPetId ? 'nulls-selected' : '', 'nulls']"
            @click="selectNulls(n)"
          >
            <div>
              <img style="height: 120px;" :src="`/nulls${calcNullsImage(n.pet_id)}.png`" />
            </div>
            <div class="pt-6 font-bold">
              <span class="guardians">Guardians</span>
              <span :class="[calcColor(n.pet_id), 'nulls-id']">#{{ n.pet_id }}</span>
            </div>
          </div>
        </div>
      </a-spin>
      <div class="button-box flex justify-center mt-12">
        <color-button
          @click="handleCreateArena"
          :disabled="combating || !myPetId || noNulls || !wallet.connected"
        >
          {{
            noNulls ? 'No Guardians' :
              !wallet.connected ? 'Wallet Not Connected' :
                !myPetId ? 'Please choose a Guardians' :
                  `Create arena with Guardians #${myPetId}`
          }}
        </color-button>
      </div>
    </NeedWalletConnect>
  </div>
</template>

<script>
import { MyNulls } from '@/backends'
import Nulls from '@/components/Items/NullsItem.vue'
import NoNulls from '@/components/Items/NoNulls.vue'
import { calcNullsImage, calcColor } from '@/utils/common'


export default {
  components: {
    Nulls, NoNulls
  },
  data() {
    return {
      calcNullsImage,
      calcColor,
      nulls: [],
      myPetId: undefined,
      approving: false,
      combating: false,
      fetching: true,
      updateDataInterval: -1
    }
  },

  async created() {
    await this.init()
  },
  unmounted() {
    clearInterval(this.updateDataInterval)
  },
  computed: {
    noNulls() {
      return this.nulls?.length < 1
    }
  },
  methods: {
    onDisconnect() {
      clearInterval(this.updateDataInterval)
    },
    async handleCreateArena() {
      const nulls = this.nulls.find(item => item.pet_id === this.myPetId)
      if (nulls.type === 255) {
        this.paramStore.arenaNullsId = nulls.pet_id
        this.paramStore.arenaNullsType = nulls.type
        this.$root.openGlobalModal('createArena')
        return
      }
    },
    async init() {
      if (!this.wallet.address) return
      clearInterval(this.updateDataInterval)

      await this.updateData()
      this.updateDataInterval = setInterval(() => {
        this.updateData(true)
      }, 5000)
    },
    async updateData(isAutoUpdate = false) {
      if (!isAutoUpdate) this.fetching = true
      const { data } = await MyNulls.findNullsCreateArena({
        address: this.wallet.address
      })
      this.fetching = false
      if (data.code !== 200) this.$message.error(data.message)

      this.nulls = data.data
    },
    selectNulls(n) {
      this.myPetId = n.pet_id
      this.arenaNullsImg = n.img
    },
  }
}
</script>


<style scoped>
.color-button {
  height: 46px;
  font-size: 18px;
}

.my-nulls-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 700px;
  height: 400px;
  overflow: auto;
}

.arena-container {
  min-width: 400px;
  padding: 20px 40px;
}

.arena-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #111111;
  line-height: 40px;
}

.arena-introduce {
  font-size: 16px;
  padding: 15px;
  text-align: center;
  vertical-align: middle;
}

.nulls {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #fff4c31a;
  border: 3px solid #ff8585;
  padding: 20px;
  flex-direction: column;
  cursor: pointer;
  transition: 0.2s ease;
  margin: 15px;
  height: 220px;
  width: 170px;
}

.nulls:hover {
  transform: scale(0.95);
  filter: brightness(0.95);
}

.nulls:hover {
  transform: scale(1.1);
  filter: brightness(1.1);
}

.nulls-selected {
  background-color: #fff4c3;
  border: 2px solid #ff7427;
}

.arena-id {
  padding: 4px 8px;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
}

.nulls-id {
  padding: 2px 4px;
  color: #ffffff;
  border-radius: 8px;
  font-size: 12px;
  margin-left: 4px;
}

.guardians {
  font-weight: bold;
  background-image: -webkit-linear-gradient(
    left,
    #ff2e2e,
    #e6d205 25%,
    #003cff 50%,
    #e6d205 75%,
    #ff5252
  );
  -webkit-text-fill-color: transparent;

  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: maskedAnimation 4s infinite linear;

  background-clip: text;
  background-size: 200% 100%;
  animation: maskedAnimation 4s infinite linear;
}

@keyframes maskedAnimation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>