<template>
    <div :class="[data?.type === 255 ? 'guardians-border' : '', 'item-frame']">
        <div v-if="purchasing" class="market-mask">
            <SyncOutlined style="font-size: 92px;" class="py-2" spin />
        </div>
        <div @click="viewDetail">
            <div>
                <span :class="`nulls-id  ${calcColor(data?.pet_id)}`">#{{ data?.pet_id }}</span>
            </div>
            <div class="text-lg size-title">{{ data?.name }}</div>
            <div class="item-content-img">
                <img :src="`/nulls${calcNullsImage(data?.pet_id)}.png`" />
            </div>
            <div class="item-price">
                <div
                    :class="[data?.type === 255 ? 'guardians' : '', 'nulls-name']"
                >{{ data?.type === 255 ? 'Guardians' : 'Nulls' }}</div>
                <div class="flex flex-col items-center mt-2">
                    <div
                        class="price-currency"
                        style="padding-right: 10px"
                    >{{ formatNumber(removeDecimal(data?.price, 6)) }} {{ data?.current }}</div>
                    <div class="price-us">≈${{ formatNumber(removeDecimal(data?.price, 6)) }}</div>
                </div>
            </div>
            <div class="item-bottom-arrange">
                <color-button buttonStyle="blue" @click="viewDetail">Detail</color-button>
                <color-button buttonStyle="orange" @click.stop="showBuyModal = true">Buy</color-button>
            </div>
        </div>
    </div>
    <custom-modal v-model="showBuyModal" :click-to-close="true">
        <MarketBuy
            v-if="renderMarketBuy"
            :key="`${data?.id}-market-buy`"
            :item="data"
            @onPurchaseStart="onPurchaseStart"
            @onPurchaseDone="onPurchaseDone"
        />
    </custom-modal>
</template>


<script>
import CustomModal from '@/components/Common/CustomModal.vue'
import MarketBuy from '@/components/ModalContents/MarketBuy.vue'
import { SyncOutlined } from '@ant-design/icons-vue'

import { removeDecimal, calcNullsImage, calcColor, addDecimal, formatNumber } from '@/utils/common'


export default {
    components: {
        MarketBuy, CustomModal, SyncOutlined
    },
    props: {
        data: {
            default: undefined,
        }
    },
    data() {
        return {
            removeDecimal, calcNullsImage, calcColor, addDecimal, formatNumber,
            showBuyModal: false,
            purchasing: false,
            renderMarketBuy: false,
            renderChangeTimeout: -1
        }
    },
    watch: {
        showBuyModal(newVal, oldVal) {
            if (newVal === oldVal) return
            else if (newVal === false) return this.renderChangeTimeout = setTimeout(() => {
                this.renderMarketBuy = false
            }, 500)
            else if (newVal === true) {
                clearTimeout(this.renderChangeTimeout)
                return this.renderMarketBuy = true
            }
        }
    },
    methods: {
        onPurchaseStart() {
            this.purchasing = true
        },
        onPurchaseDone(status) {
            this.purchasing = false
            if (status === 1) return this.$emit('onItemPurchased')
        },
        viewDetail() {
            this.$router.push({
                name: 'MarketNullsInfo',
                params: {
                    sellId: this.data?.id,
                    petId: this.data?.pet_id,
                    petType: this.data?.type,
                    petPrice: this.data?.price,
                    petCurrent: this.data?.current
                }
            })
        }
    }
}
</script>

<style scoped>
.guardians {
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

.nulls-name {
    font-weight: bold;
    font-size: 18px;
}

.item-frame {
    width: 295px;
    height: 376px;
    border-radius: 10px;
    background-color: #fff4c333;
    border: 2px solid #ff742733;
    user-select: none;
    cursor: pointer;
    transition: 0.2s ease;
    position: relative;
    margin: 0 10px 30px 10px;
    padding: 30px 30px 0 30px;
    overflow: hidden;
}

.item-frame:hover {
    background-color: #fff4c34d;
}

.item-frame:active {
    filter: brightness(0.9);
}

.guardians-border {
    border: 2px dashed #ff8585;
}

.nulls-id {
    border-radius: 12px;
    padding: 4px 8px;
    color: #ffffff;
    font-weight: bold;
}

.item-content-img {
    display: flex;
    justify-content: center;
    height: 133px;
    margin: 15px 0;
    transition: 0.2s ease;
}

.size-title {
    margin-top: 8px;
    padding: 0 4px;
    color: #111111;
}

.item-price {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
}

.price-currency {
    font-size: 18px;
    font-weight: bold;
    color: #ff7427;
}

.price-us {
    font-weight: 400;
    font-size: 12px;
    color: #666666;
}

.item-bottom-arrange {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
}

.market-mask {
    left: 0;
    top: 0;
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
</style>