import { CHAIN_ID_HEX, CHAIN_PARAMS } from './constants'

export class WalletWatcher {
    /** @type {import('ethers').providers.Web3Provider} **/
    provider
    /** @type {import('ethers').providers.JsonRpcSigner | undefined} **/
    signer
    /** @type {string | undefined} **/
    signerAddress
    /** @type {import('@/utils/wallet/connectors').BaseConnector} **/
    connector

    /* Create not initialized WalletWatcher */
    constructor(connector) {
        this.connector = connector
    }

    async init() {

    }

    async requestSwitchNetwork() {
        console.log(`Connector [${this.connector.label}] requestSwitchNetwork start`)
        await this.connector.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_ID_HEX }],
        })
    }

    async requestAddNetwork() {
        console.log(`Connector [${this.connector.label}] requestAddNetwork start`)
        await this.connector.request({ method: 'wallet_addEthereumChain', params: CHAIN_PARAMS })
    }

    /** 
     * Initialized WalletWatcher async
     * @param {{
     *  provider?: import('ethers').providers.Web3Provider | undefined, 
     *  cb?: (...args: any[]) => any}}
     * @return {Promise<WalletWatcher>} 
     **/
    async connect({ provider, cb }) {
        this.provider = provider?._isProvider ? provider : await this.connector.getProvider()
        await this.initSigner()
        this.watchAll(cb)
        return this
    }

    async switchNetwork() {
        console.log(`Connector [${this.connector.label}] switchNetwork start`)
        try {
            await this.requestSwitchNetwork()
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await this.requestAddNetwork()
                    await this.requestSwitchNetwork()
                } catch (addErr) {
                    // handle "add" error
                    throw new Error(`Could not add chain: ${addErr.message}`)
                }
            } else {
                if (switchError.code === -32002) /* Already exists */ return
                throw new Error(`Unknown switchError: ${switchError.message}`)
            }
            // handle other "switch" errors
        }
    }

    async getSigner() {
        await this.initSigner()
        const { signer, signerAddress } = this
        return { signer, signerAddress }
    }

    async initSigner() {
        this.signer = this.provider.getSigner()
        this.signerAddress = await this.signer.getAddress()
    }

    /** @param {((...args: any[]) => any) | undefined} cb **/
    watchAll(cb) {
        this.watchEvents.forEach(
            ev => this.connector.regist(ev, cb)
        )
    }

    /** @param {((...args: any[]) => any) | undefined} cb **/
    watchConnect(cb) {
        this.connector.regist('connect', cb)
    }

    /** @param {((...args: any[]) => any) | undefined} cb **/
    watchDisconnect(cb) {
        this.connector.regist('disconnect', cb)
    }

    /** @param {((...args: any[]) => any) | undefined} cb **/
    watchMessage(cb) {
        this.connector.regist('message', cb)
    }

    /** @param {((...args: any[]) => any) | undefined} cb **/
    watchAccountChanged(cb) {
        this.connector.regist('accountsChanged', cb)
    }

    /** @param {((...args: any[]) => any) | undefined} cb **/
    watchChainChanged(cb) {
        this.connector.regist('chainChanged', cb)
    }

    async chainIdNumber() {
        const { chainId } = await this.provider.getNetwork()
        console.log(`Connector [${this.connector.label}] Get chainIdNumber: `, chainId)
        return chainId
    }

    async chainIdHexString() {
        const { chainId } = await this.provider.getNetwork()
        const chainIdHex = `0x${chainId?.toString(16)}`
        console.log(`Connector [${this.connector.label}] Get chainIdHexString: `, chainIdHex)
        return chainIdHex
    }

    get watchEvents() {
        return ['connect', 'disconnect', 'message', 'chainChanged', 'accountsChanged']
    }
}
