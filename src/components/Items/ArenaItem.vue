<template>
    <div v-show="!(hideInCombat && data?.combating)" class="arena-item">
        <div
            v-if="wallet.address?.toLowerCase() === data?.owner_address?.toLowerCase()"
            class="your-own-arena"
        >Your own</div>
        <div v-if="showMask" class="arena-mask">
            <SyncOutlined style="font-size: 92px;" class="py-2" spin />
            <!-- {{ statusText }} -->
            <div v-show="combatTime" class="py-4">{{ formatDate(combatTime, { fmt: 'mm:ss' }) }}</div>
        </div>
        <div
            class="arena-content"
            @click="showModal = true"
            :style="ended ? 'pointer-events: none' : ''"
        >
            <img class="arena-item-img" :src="`/gamebg${calcArenaImage(data?.item_id)}.jpg`" />
            <div class="arena-item-content">
                <div>
                    <div
                        :class="`arena-num ${calcColor(data?.item_id)} inline-block`"
                    >#{{ data?.item_id }}</div>
                </div>
                <div class="arena-item-info mt-3">
                    <img src="/market@1x.png" />
                    Tickets: {{ formatNumber(removeDecimal(data?.tickets, data?.token_precision)) }}
                    {{ data?.token_name }}
                </div>
                <div class="arena-item-info mt-1">
                    <img src="/star-small.png" />
                    Multiplier: {{ data?.max_multipe }}x
                </div>
                <div class="arena-item-info mt-1">
                    <img src="/diamond-small.png" />
                    Prize Pool:
                    {{ formatNumber(removeDecimal(ended ? data?.max_jackpot : data?.jackpot, data?.token_precision)) }}
                    {{ data?.token_name }}
                </div>
            </div>
            <div class="flex items-center justify-center pt-2 pb-6">
                <color-button
                    buttonStyle="yellow"
                    :disabled="ended"
                >{{ ended ? 'Ended.' : 'Go Combat!' }}</color-button>
            </div>
        </div>
    </div>
    <custom-modal v-model="showModal" :click-to-close="true">
        <SelectNullsCombat
            v-if="renderSelectNullsModal"
            :key="`${data?.item}-selectNullsCombat`"
            :arena="data"
            @combatStart="combatStart"
            @combatEnd="combatEnd"
            @transcationSended="transcationSended"
            @onWin="onWin"
            @onLose="onLose"
            @combatApproved="combatApproved"
            @combatApproving="combatApproving"
            @combatFailed="combatFailed"
        />
    </custom-modal>
</template>

<script>
import CustomModal from '@/components/Common/CustomModal.vue'
import SelectNullsCombat from '@/components/ModalContents/SelectNullsCombat.vue'

import { formatNumber, removeDecimal, calcArenaImage, calcColor, formatDate } from '@/utils/common'
import { SyncOutlined } from '@ant-design/icons-vue'


export default {
    components: {
        CustomModal, SelectNullsCombat, SyncOutlined
    },
    props: {
        data: {
            default: undefined
        },
        hideInCombat: {
            default: false
        },
        ended: {
            default: false
        }
    },
    data() {
        return {
            formatNumber, removeDecimal, calcArenaImage, calcColor, formatDate,
            showModal: false,
            statusText: '',
            combatTime: 0,
            showMask: false,
            combating: false,
            combatTimeInterval: 0,
            renderSelectNullsModal: false,
            renderChangeTimeout: -1
        }
    },
    watch: {
        combating(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.combatTime = 0
            }
        },
        showModal(newVal, oldVal) {
            if (newVal === oldVal) return
            else if (newVal === false) return this.renderChangeTimeout = setTimeout(() => {
                this.renderSelectNullsModal = false
            }, 500)
            else if (newVal === true) {
                clearTimeout(this.renderChangeTimeout)
                return this.renderSelectNullsModal = true
            }
        }
    },
    methods: {
        combatStart(e) {
            this.statusText = 'Fighting...'
            this.showModal = false
            this.$emit('combatStart', e)
            this.showMask = true
        },
        combatEnd(e) {
            this.statusText = ''
            this.showMask = false
            this.$emit('combatEnd', e)
            clearInterval(this.combatTimeInterval)
        },
        transcationSended(e) {
            clearInterval(this.combatTimeInterval)
            this.combatTimeInterval = setInterval(() => {
                this.combatTime += 1000
            }, 1000)
            this.$emit('transcationSended', e)
        },
        onWin(e) {
            this.$emit('onWin', e)
        },
        onLose(e) {
            this.$emit('onLose', e)
        },
        combatApproved(e) {
            this.$emit('combatApproved', e)
        },
        combatApproving(e) {
            this.$emit('combatApproving', e)
        },
        combatFailed(e) {
            this.$emit('combatFailed', e)
        }
    },
}
</script>

<style scoped>
.arena-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 266px;
    border-radius: 10px;
    border: 2px solid #ff7427b3;
    user-select: none;
    cursor: pointer;
    transition: 0.2s ease;
    position: relative;
    overflow: hidden;
    margin: 0 1rem 2rem 1rem;
}

.arena-content {
    width: 100%;
}

.arena-item:hover {
    background-color: #fff4c34d;
    border: 2px solid #ffe77b;
}

.arena-item:active {
    border: 2px solid #ffdf52;
    transform: scale(0.9);
}

.arena-item:last-child:nth-child(4n - 1) {
    margin-right: calc(266px + 4rem);
}

.arena-item-img {
    font-size: 20px;
    display: flex;
    height: 140px;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: #aeceff4d;
    border-radius: 8px 8px 0 0;
}

.arena-item-content {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 1rem;
}

.arena-item-content > div > img {
    height: 14px;
    width: 14px;
    margin-right: 4px;
}

.arena-item-info {
    display: flex;
    align-items: center;
    color: #111111;
    font-size: 13px;
}

.arena-mask {
    z-index: 15;
    user-select: none;
    cursor: wait;
    position: absolute;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #00000099;
    color: #ffffff;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    text-shadow: 1px 1px 3px #000000;
}

.your-own-arena {
    z-index: 16;
    user-select: none;
    position: absolute;
    right: 0;
    top: 0;
    color: #ffffff;
    background-color: #00000099;
    text-shadow: 1px 1px 3px #000000;
    padding: 4px 8px;
    font-size: 12px;
    color: #ffdf52;
    font-weight: bold;
    border-radius: 0 0 0 8px;
}

.arena-num {
    padding: 2px 6px;
    border-radius: 16px;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
}
</style>