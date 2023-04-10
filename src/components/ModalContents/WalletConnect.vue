<template>
    <div class="wallet-w">
        <div
            class="wallet-title"
        >{{ wallet.connected ? wallet.isCorrectNetwork ? `Connected with ${wallet.connectedWallet} ✔️` : `Wrong Network ❓` : 'Connect Wallet' }}</div>
        <div
            v-if="!wallet.connected"
            class="wallet-introduce"
        >By connecting a wallet, you agree to Nulls-World ’s Terms of Service and acknowledge that you have read and understand the Nulls-World disclaimer.</div>
        <div v-else class="flex justify-center">
            <a :href="accountExplorer(wallet.address)" target="_blank">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View on Explorer
            </a>
            <a>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy address
            </a>
        </div>

        <div class="wallet-top">
            <div
                v-for="connector in connectors"
                :key="connector.label"
                :class="[
                    connector.connecting ? 'wallet-connecting' : '',
                    $root.connecting && !connector.connecting ? 'wallet-disabled-click' : '',
                    connector.label === wallet.connectedWallet ? 'wallet-frame-opt' : '',
                    connector.label === wallet.connectedWallet ? 'wallet-connected wallet-disabled-click' : '', 'wallet-frame'
                ]"
                @click="selectWallet(connector)"
            >
                <div class="flex items-center">
                    <LoadingOutlined v-if="connector.connecting" class="px-2" spin />
                    <div v-else-if="connector.label === wallet.connectedWallet" class="green-dot"></div>
                    {{ walletLabel(connector) }}
                </div>
                <img class="img-h" :src="`/${connector.img}`" />
            </div>
        </div>

        <div class="flex justify-center items-center mt-12">
            <color-button
                v-if="wallet.connected && !wallet.isCorrectNetwork && wallet.connectedWallet !== 'WalletConnect'"
                style="font-size: 16px; margin: 0 8px;"
                buttonStyle="yellow"
                @click="wallet.switchNetwork"
            >Switch Network</color-button>
            <color-button
                v-if="wallet.connectedWallet === 'WalletConnect'"
                style="font-size: 16px; margin: 0 8px;"
                @click="wallet.tryDisconnect"
            >Disconnect WalletConnect</color-button>
        </div>
    </div>
</template>

<script>
import { markRaw } from 'vue'
import { cutEthAddress, accountExplorer } from '@/utils/common'
import { walletConnectors } from '@/utils/wallet/connectors'


import { LoadingOutlined } from '@ant-design/icons-vue'


export default {
    components: {
        LoadingOutlined
    },
    data() {
        return {
            cutEthAddress,
            accountExplorer,
            width: '287px',
            connectors: markRaw(walletConnectors),
            showMask: false,
        }
    },
    methods: {
        walletLabel(connector) {
            if (connector.connecting) return 'Connecting...'

            return connector.isValid() ?
                this.wallet.connected && connector.label === this.wallet.connectedWallet ?
                    `Account (${cutEthAddress(this.wallet.address, 8)})` : connector.label
                : `Please Install ${connector.label}`
        },
        setConnecting(bool, connector) {
            if (connector) connector.connecting = bool
            this.$root.setConnecting(bool)
        },
        async selectWallet(connector) {
            if (connector.connecting) return

            if (!connector.isValid() && connector.link) {
                window.open(connector.link, "_blank")
                return
            }

            this.setConnecting(true, connector)
            const result = await this.wallet.init({ connector })
            this.setConnecting(false, connector)
            if (!result) return

            if (this.wallet?.connected) {
                this.$root.showWalletConnect = false
                this.wallet.connectedWallet = connector.label
            }
        },
        openInterface() {
            this.showMask = true
        },
        close() {
            this.showMask = false
        }
    }
}
</script>


<style scoped>
a {
    padding: 20px;
    align-items: center;
    display: flex;
}

a svg {
    margin-right: 5px;
}

.wallet-w {
    width: 600px;
    margin: 38px 103px 38px 87px;
}

.wallet-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #111111;
    line-height: 40px;
}

.wallet-top {
    margin-top: 43px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.wallet-frame {
    height: 68px;
    padding: 0 30px;
    border-radius: 10px;
    border: 2px solid #f5e3d7;
    display: flex;
    font-size: 18px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin: 10px 10px;
    transition: 0.2s ease;
    user-select: none;
}

.img-h {
    height: 26px;
}

.wallet-connecting {
    pointer-events: none;
    font-weight: bold;
    background-color: #ffebbf !important;
    border-color: #ffb951 !important;
}

.wallet-connected {
    font-weight: bold;
}

.wallet-disabled-click {
    pointer-events: none;
}

.wallet-frame:hover {
    background-color: #fff2ea;
}

.wallet-frame:active {
    border-color: #ff7427;
    transform: scale(0.95);
}

.wallet-frame:active .img-h {
    filter: brightness(0.9);
}

.wallet-frame-opt {
    background-color: #fff2ea;
    border: 2px solid #ff7427;
}

.wallet-introduce {
    font-size: 16px;
    padding: 15px 30px;
    text-align: center;
}

.green-dot {
    height: 12px;
    width: 12px;
    background-color: #01ba96;
    border-radius: 10px;
    margin-right: 10px;
}
</style>