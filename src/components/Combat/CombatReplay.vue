<template>
    <div
        v-if="data"
        class="arena mt-3"
        ref="arenaReplays"
        :style="`background: ${background} rgba(0, 0, 0, 0.2);`"
    >
        <div class="handle-button-box">
            <color-button buttonStyle="yellow" @click="handleSaveImage">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </color-button>
            <router-link :to="`/arena/combat/${data?.id}`" target="_blank" tag="a">
                <color-button buttonStyle="yellow">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                </color-button>
            </router-link>
        </div>
        <div class="arena-info-box">
            <div class="arena-info-head">
                <div class="arena-info-icon">
                    <img :src="`/nulls${guardiansNulls}.png`" />
                </div>
                <div class="flex items-center">
                    <div style="font-size: 16px;">Arena</div>
                    <div :class="[calcColor(data?.item_id), 'arena-id ml-2']">#{{ data?.item_id }}</div>
                </div>
            </div>
            <div class="arena-info-content">
                <div class="arena-info-line">
                    <div class="arena-info-left">
                        <img src="/ring-small.png" />
                        <span>Combat ID</span>
                    </div>
                    <div># {{ data?.id }}</div>
                </div>
                <div class="arena-info-line">
                    <div class="arena-info-left">
                        <img src="/star-small.png" />
                        <span>Multiplier</span>
                    </div>
                    <div>{{ data?.current_max_multipe }}x</div>
                </div>
                <div class="arena-info-line">
                    <div class="arena-info-left">
                        <img src="/diamond-small.png" />
                        <span>Prize pool</span>
                    </div>
                    <div>{{ formatNumber(removeDecimal(data?.current_jackpot, data?.token_precision)) }} {{ data?.token_name }}</div>
                </div>
                <div class="arena-info-line">
                    <div class="arena-info-left">
                        <img src="/dragon-small.png" />
                        <span>Date</span>
                    </div>
                    <div>{{ formatDate(data?.create_time) }}</div>
                </div>
            </div>
        </div>
        <div class="arena-combat-info">
            <div>
                <div class="font-bold">Combat #{{ data?.item_id }}:</div>
                <span class="font-bold mr-2">Arena</span>
                <a
                    style="color: #FEF9E7;"
                    :href="accountExplorer(data?.ring_address)"
                >{{ cutEthAddress(data?.ring_address, 6) }}</a>
                <span class="px-4 font-bold">VS</span>
                <span class="font-bold mr-2">Challenger</span>
                <a
                    style="color: #FEF9E7;"
                    :href="accountExplorer(data?.challenger_address)"
                >{{ cutEthAddress(data?.challenger_address, 6) }}</a>
            </div>
            <div class="mt-2">
                <div class="font-bold">Transcation Hash:</div>
                <a
                    style="color: #FEF9E7;"
                    :href="txExplorer(data?.tx_hash)"
                >{{ cutEthAddress(data?.tx_hash, 18) }} (Click to Explore)</a>
            </div>
        </div>
        <div class="arena-nulls-box">
            <div class="arena-nulls">
                <div class="arena-nulls-item">
                    <img class="status" :src="`/${guardiansWin ? 'victory' : 'defeat'}@hd.png`" />

                    <img
                        :src="`/nulls${guardiansNulls}.png`"
                        :class="[leftRotate.includes(guardiansNulls) ? 'mirror' : '', guardiansWin ? 'win' : 'lose']"
                    />

                    <div class="player guardians">
                        Arena
                        <div
                            :class="[calcColor(data?.ring_pet_id), 'nulls-id']"
                        >#{{ data?.ring_pet_id }}</div>
                    </div>
                </div>
                <div>
                    <div
                        class="bonus"
                    >{{ data?.isWin == 0 ? '-' : '+' }}{{ formatNumber(removeDecimal(data?.value, data?.token_precision)) }} {{ data?.token_name }}</div>
                </div>
                <div class="arena-nulls-item">
                    <img class="status" :src="`/${!guardiansWin ? 'victory' : 'defeat'}@hd.png`" />

                    <img
                        :src="`/nulls${challengerNulls}.png`"
                        :class="[!leftRotate.includes(challengerNulls) ? 'mirror' : '', !guardiansWin ? 'win' : 'lose']"
                    />

                    <div class="player challenger">
                        Challenger
                        <div
                            :class="[calcColor(data?.challenger_pet_id), 'nulls-id']"
                        >#{{ data?.challenger_pet_id }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="arena mt-3" v-else>
        <div
            class="flex items-center justify-center w-full h-full font-bold italic"
            style="border-radius: 12px; font-size: 48px; background-color: rgba(255, 255, 255, .8); "
        >Combat Loading...</div>
    </div>
</template>


<script>
import { Ring } from '@/backends'
import {
    removeDecimal,
    formatNumber,
    formatDate,
    addDecimal,
    calcArenaImage,
    calcNullsImage,
    txExplorer,
    accountExplorer,
    cutEthAddress,
    calcColor,
    saveElementImage
} from '@/utils/common'

export default {
    data() {
        return {
            removeDecimal,
            formatNumber,
            formatDate,
            addDecimal,
            calcArenaImage,
            calcNullsImage,
            txExplorer,
            accountExplorer,
            cutEthAddress,
            calcColor,
            saveElementImage,
            leftRotate: [1, 5, 7, 8, 9, 10, 11, 12, 14, 16],
            data: null
        }
    },
    props: {
        combatId: {
            default: ''
        },
        combatData: {
            default: null
        }
    },
    async created() {
        if (this.combatData) {
            this.data = this.combatData
        } else {
            this.fetchData()
        }
    },
    watch: {
        combatData(newVal, oldVal) {
            if (newVal === oldVal) return
            this.data = newVal
        }
    },
    computed: {
        guardiansNulls() {
            return calcNullsImage(this.data?.ring_pet_id)
        },
        challengerNulls() {
            return calcNullsImage(this.data?.challenger_pet_id)
        },
        background() {
            return `url(gamebg${calcArenaImage(this.data?.item_id)}.jpg)`
        },
        guardiansWin() {
            return this.data?.isWin === 1
        }
    },
    methods: {
        async fetchData() {
            if (!this.combatId || this.data) return
            const { data } = await Ring.getCombatResult({ id: this.combatId })
            if (data.code !== 200) return this.$message.error(data.message)
            this.data = data.data
            console.log(data)
        },
        tokenAmount(number) {
            return formatNumber(removeDecimal(number, this.tokenDecimals))
        },
        handleSaveImage() {
            saveElementImage(this.$refs['arenaReplays'])
        }
    },
}

</script>

<style scoped>
.arena {
    position: relative;
    height: 620px;
    background-size: cover;
    box-shadow: 1px 1px 5px #0000004d;
    width: 1100px;
    background-blend-mode: multiply;
    border-radius: 16px;
    border: 5px solid #ffffff66;
}

.arena-nulls-box {
    display: flex;
    justify-content: center;
    position: absolute;
    height: 310px;
    padding: 30px;
    width: 100%;
    bottom: 0;
}

.arena-nulls {
    display: flex;
    justify-content: space-between;
    width: 70%;
}

.arena-nulls div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.arena-nulls img {
    width: 156px;
}

.arena-nulls-item {
    position: relative;
    display: flex;
    flex-direction: column;
    user-select: none;
    display: flex;
    align-items: flex-end;
}

.arena-nulls-box .status {
    position: absolute;
    top: -90px;
    z-index: 5;
}

.arena-info-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 0 0 3px #000000;
}

.arena-info-left {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #ffffff;
}

.arena-info-left img {
    height: 24px;
    width: 24px;
    margin: 0 10px 0 6px;
}

.arena-info-line div:last-child {
    color: #fff100;
    padding: 0 10px;
}

.arena-info-box {
    position: absolute;
    top: 43px;
    left: 43px;
    height: 200px;
    width: 273px;
    user-select: none;
}

.arena-info-head {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 52px;
    background-image: linear-gradient(#505dd8, #439bff);
    border: 2px solid #00fdf8;
    border-radius: 5px 5px 0 0;
    color: #ffffff;
    text-shadow: 0 0 3px #00000099;
    font-weight: bold;
    font-style: italic;
}

.arena-info-icon {
    position: absolute;
    top: calc(52px - 73px);
    left: -16px;
    height: 73px;
    width: 80px;
    background-image: url("/arena-info-icon.png");
    background-repeat: no-repeat;
    background-size: 80px 73px;
    overflow: hidden;
    border: 1px solid transparent;
}

.arena-info-icon img {
    position: absolute;
    left: 2px;
    width: calc(100% - 10px);
    height: 100%;
    top: 10px;
}

.arena-info-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px 10px;
    height: calc(100% - 52px);
    background-image: linear-gradient(#505dd8b3, #439bffb3);
    border: 2px solid #00fdf8;
    border-top: 0;
    border-radius: 0 0 5px 5px;
}

.mirror {
    transform: rotateY(180deg);
}

.arena-nulls-item .player {
    position: relative;
    margin: 15px 0;
    font-size: 18px;
    font-weight: bolder;
    font-style: italic;
    padding: 6px 25px;
    border-radius: 21px;
    background-color: #00000066;
    text-shadow: 0 0 3px #00000066;
    border: 3px solid #fef9e7;
    box-shadow: 0 0 10px #ffffff66 inset, 0 0 10px #00000033;
}

.guardians {
    color: rgb(255, 254, 205);
}

.challenger {
    color: #ffffff;
}

.win {
    filter: brightness(1.1);
}

.lose {
    filter: brightness(0.8);
}

.arena-combat-info {
    position: absolute;
    right: 80px;
    top: 50px;
    width: 500px;
    border-radius: 16px;
    padding: 15px;
    color: #ffffff;
    background-color: #00000066;
    text-shadow: 0 0 3px #00000066;
    border: 3px solid #fef9e7;
    box-shadow: 0 0 10px #ffffff66 inset, 0 0 10px #00000033;
}

.bonus {
    margin-bottom: 20px;
    color: #ffe999;
    font-weight: bold;
    font-size: 24px;
    padding: 12px 25px;
    border-radius: 32px;
    background-color: #ffffff33;
    font-style: italic;
    text-shadow: 0 0 3px #00000099;
    border: 3px solid #fef9e7;
    box-shadow: 0 0 10px #ffffff66 inset, 0 0 10px #00000033;
    user-select: none;
}

.arena-id {
    display: flex;
    padding: 2px 10px;
    border-radius: 16px;
}

.nulls-id {
    position: absolute;
    top: -15px;
    right: -15px;
    color: #ffffff;
    border-radius: 16px;
    padding: 2px 8px;
    font-weight: bold;
    font-size: 12px;
    box-shadow: 0 0 3px #00000099;
}

.handle-button-box {
    position: absolute;
    right: -110px;
    bottom: 40px;
    border-radius: 16px;
    padding: 0 10px;
    border: 3px solid #fef9e7;
    text-shadow: 0 0 3px #00000099;
    box-shadow: 0 0 10px #ffffff66 inset, 0 0 10px #00000033;
}

.handle-button-box .color-button {
    margin: 15px 0;
}
</style>