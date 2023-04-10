<template>
    <div class="flex">
        <div class="flex items-center">
            <NullsPreview :nullsId="item?.pet_id" :nullsType="item?.type" />
        </div>
        <NeedWalletConnect
            @onWalletConnect="init"
            @onAddressChange="init"
            @onWalletDisconnect="onDisconnect"
        >
            <a-spin tip="Loading..." :spinning="approving || purchasing">
                <div class="arena-container">
                    <div class="arena-title">Purchase Nulls</div>
                    <div class="arena-introduce">Please confirm purchase details</div>
                    <div class="py-12">
                        <div class="py-2 font-bold" style="font-size: 16px;">Target Token</div>
                        <div class="token-select">
                            <div class="token-select-left">
                                <img
                                    class="token-icon"
                                    :src="`/tokens/${tokenSymbol?.toLowerCase()}.svg`"
                                />
                                <div class="token-select-content">
                                    <div class="token-symbol">{{ tokenSymbol }}</div>
                                    <div
                                        class="token-select-balance"
                                    >Your Balance: {{ formatNumber(removeDecimal(tokenBalance, currentDecimal)) }} {{ tokenSymbol }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-column">
                        <div>Nulls ID</div>
                        <div class="px-4 font-bold">
                            <span :class="[calcColor(item?.pet_id), 'nulls-id']">#{{ item?.pet_id }}</span>
                        </div>
                    </div>
                    <div class="form-column">
                        <div>Price</div>
                        <div class="px-4 font-bold" style="color: #ff761a;">
                            <span
                                class="px-2"
                            >{{ formatNumber(removeDecimal(item?.price, currentDecimal)) }}</span>
                            <span>{{ tokenSymbol }}</span>
                        </div>
                    </div>
                    <div class="form-column">
                        <div>Your Balance</div>
                        <div class="px-4 font-bold" style="color: #ff761a;">
                            <span
                                class="px-2"
                            >{{ formatNumber(removeDecimal(tokenBalance, currentDecimal)) }}</span>
                            <span>{{ tokenSymbol }}</span>
                        </div>
                    </div>
                    <div class="flex justify-center mt-12">
                        <color-button
                            @click="handleBuy"
                            :disabled="!wallet.connected || balanceNotEnough || approving || purchasing"
                        >
                            <LoadingOutlined
                                v-show="approving || purchasing"
                                class="px-2 font-bold"
                                spin
                            />
                            {{
                                !wallet.connected ? 'Wallet Not Connected' :
                                    balanceNotEnough ? `Insufficient ${tokenSymbol}` :
                                        approving ? 'Approving...' :
                                            purchasing ? 'purchasing...' :
                                                `Purchase Now!`
                            }}
                        </color-button>
                    </div>
                </div>
            </a-spin>
        </NeedWalletConnect>
    </div>
</template>

<script>
import { NullsPetToken } from '@/contracts'
import { LoadingOutlined } from '@ant-design/icons-vue'

import NullsPreview from '@/components/Items/NullsPreview.vue'
import NeedWalletConnect from '@/components/Common/NeedWalletConnect.vue'

import { formatNumber, calcColor, removeDecimal } from '@/utils/common'


export default {
    components: {
        NullsPreview, LoadingOutlined, NeedWalletConnect
    },
    props: {
        item: {
            default: undefined
        }
    },
    data() {
        return {
            formatNumber, calcColor, removeDecimal,
            approving: false,
            purchasing: false,
            tokenBalance: 0,
            updateBalanceInterval: -1,
            currentDecimal: 6
        }
    },
    async created() {
        await this.init()
    },
    unmounted() {
        clearInterval(this.updateBalanceInterval)
    },
    computed: {
        balanceNotEnough() {
            return this.tokenBalance < this.item?.price
        },
        tokenSymbol() {
            return this.item?.current
        }
    },
    methods: {
        onDisconnect() {
            clearInterval(this.updateBalanceInterval)
        },
        async init() {
            if (!this.wallet.connected) return
            clearInterval(this.updateBalanceInterval)

            // Create contracts
            this.tokenContract = this.wallet.createERC20(this.item?.current_contract)
            this.petTokenContract = this.wallet.createContract(NullsPetToken)


            this.updateEggBalance().then(() => {
                this.updateBalanceInterval = setInterval(this.updateEggBalance, 10_000);
            })
        },
        async updateEggBalance() {
            this.tokenBalance = Number(await this.tokenContract['balanceOf'](this.wallet.address))
        },
        async handleBuy() {
            if (!this.item?.pet_id) return
            if (this.approving || this.purchasing) return
            const nullsId = this.item.pet_id

            // Buy
            this.$emit('onPurchaseStart')
            await this.wallet.approveAndSend({
                handle: 'BuyPets',
                approveContract: this.tokenContract,
                approveChecker: this.item.price,
                component: this,
                transcationFactory: async () => {
                    return await this.petTokenContract['buyPet'](nullsId)
                },
                transcationOptions: {
                    statusProps: 'purchasing',
                    onComplete: () => this.$emit('onPurchaseDone', 1),
                    onError: () => this.$emit('onPurchaseDone'),
                    messages: {
                        startTitle: 'Purchasing Pets 📑',
                        waitingTitle: 'Waiting for Purchasing result 📑',
                        successTitle: 'Successful Purchase ✔️',
                        successContent: `Successfully purchased Nulls #${nullsId}, please check in MyNulls!`,
                        errorTitle: 'Purchase failed ❌'
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.token-select {
    min-width: 440px;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 14px 16px;
    border-radius: 6px;
    border: 2px solid #ff981a;
    transition: 0.2s ease;
}

.token-select-content {
    padding: 0 8px;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    font-size: 16px;
}

.token-select-balance {
    font-size: 14px;
}

.token-symbol {
    font-weight: bold;
}

.token-icon {
    margin-right: 15px;
    height: 42px;
    width: 42px;
    padding: 0 4px;
}

.token-select:hover {
    background-color: #ff981a4d;
}

.token-select-left {
    display: flex;
    flex: 1;
}

.arena-container {
    padding: 20px 40px;
}

.form-column {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    padding: 4px 0;
}

.form-column div:first-child {
    font-weight: bold;
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
}

.color-button {
    height: 46px;
    font-size: 18px;
}

.nulls-id {
    padding: 4px 8px;
    color: #ffffff;
    border-radius: 12px;
    font-size: 14px;
}
</style>