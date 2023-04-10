import { ethers, providers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { CHAIN_RPC_MAP, CHAIN_ID } from './constants'

export class BaseConnector {
    label = ''
    img = ''
    isValid = () => true
    link = ''
    connecting = false

    async getProvider() {
        console.error('[getProvider()] WalletConnector Not implemented')
    }

    async enable() {
        console.error('[enable()] WalletConnector Not implemented')
    }

    async request() {
        console.error('[request()] WalletConnector Not implemented')
    }

    get eventRegister() {
        console.error('[eventRegister()] WalletConnector Not implemented')
    }

    /** 
     * @param {string} event
     * @param {((...args: any[]) => any) | undefined} cb 
     * **/
    regist(event, cb) {
        this.eventRegister.on(event, (data) => { cb({ event, data }) })
    }
}


export class Metamask extends BaseConnector {
    label = 'MetaMask'
    img = 'metamask.png'
    isValid = () => !!window?.ethereum
    link = 'https://metamask.io/'
    /** @type {ethers.providers.Web3Provider || undefined} **/
    provider = undefined

    async getProvider() {
        if (!window?.ethereum) return
        await this.enable()
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        return this.provider
    }

    get eventRegister() {
        return window?.ethereum
    }

    async request(...args) {
        return await window?.ethereum?.request(...args)
    }

    async enable() {
        return await this.request({ method: 'eth_requestAccounts' })
    }

}

export class WalletConnect extends BaseConnector {
    label = 'WalletConnect'
    img = 'walletconnect.png'
    link = 'https://walletconnect.org/'
    infuraId = '37b7a0addffc49d6b91c6cd28d48b1c3'
    bridge = 'https://bridge.walletconnect.org'
    /** @type {WalletConnectProvider} **/
    connectProvider
    /** @type {providers.Web3Provider} **/
    provider
    connecting

    storageCheck() {
        const WALLETCONNECT_KEY = 'walletconnect'
        let wc = localStorage.getItem(WALLETCONNECT_KEY)
        if (wc) {
            wc = JSON.parse(wc)
            if (wc?.chainId !== CHAIN_ID) localStorage.removeItem(WALLETCONNECT_KEY)
        }
    }

    async getProvider() {
        await this.enable()
        return this.provider = new providers.Web3Provider(this.connectProvider)
    }

    get eventRegister() {
        return this.provider
    }

    async request(...args) {
        return await this.connectProvider.request(...args)
    }

    async disconnect() {
        await this.connectProvider.disconnect()
    }

    enable() {
        this.storageCheck()
        return new Promise(async (resolve, reject) => {
            const connectProvider = new WalletConnectProvider({
                infuraId: this.infuraId,
                bridge: this.bridge,
                qrcode: true,
                chainId: CHAIN_ID,
                rpc: CHAIN_RPC_MAP
            })
            this.connectProviderEvents.forEach(ev => {
                connectProvider.connector.on(ev, (err, payload) => {
                    console.log('[WalletConnect] Event: ', payload, 'Err: ', err)
                    if (payload?.event === 'disconnect') {
                        if (this.connecting) {
                            this.connecting = false
                            reject(new Error('[WalletConnect] User has refused to connect.'))
                        }
                        localStorage.removeItem('walletconnect')
                    }

                    if (payload?.event === 'connect') {
                        const data = payload?.params.find(item => item.chainId)
                        if (this.connecting && data?.chainId !== CHAIN_ID) {
                            this.connecting = false
                            localStorage.removeItem('walletconnect')
                            reject(new Error(`[WalletConnect] Please use the right blockchain network! Current: ${data?.chainId}, Target: ${CHAIN_ID}`))
                        }
                    }
                })
            })
            try {
                this.connecting = true
                await connectProvider.enable()
                this.connectProvider = connectProvider
                resolve(connectProvider)
            } catch (err) {
                localStorage.removeItem('walletconnect')
                reject(new Error(`[WalletConnect] ${err.message}`))
            }
        })
    }

    get connectProviderEvents() {
        return ['connect', 'disconnect', 'session_request', 'session_update', 'call_request', 'wc_sessionRequest', 'wc_sessionUpdate', 'display_uri']
    }

}


export const walletConnectors = [
    new Metamask(),
    new WalletConnect()
]
