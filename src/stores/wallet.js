import { ref, markRaw } from 'vue'
import { defineStore } from 'pinia'
import { Contract } from 'ethers'

import { ERC20, CONTRACT_ADDRESS } from '@/contracts'

import { cutEthAddress, addDecimal, calcApproveAmount, guid } from '@/utils/common'
import { WalletWatcher } from '@/utils/wallet/watcher'
import { Metamask, WalletConnect } from '@/utils/wallet/connectors'
import { findEvent } from '@/utils/wallet/utils'
import { CHAIN_ID, WALLET_TIPS, WALLET_ERRORS, DEFAULT_TX_MESSAGES } from '@/utils/wallet/constants'


export const useWallet = (global) => {
    return defineStore('wallet', {
        state: () => ({
            /** @type {{ string: { address: string } }} */
            accountList: {},
            /** @type {string | null} */
            address: null,
            chainId: null,
            /** @type { import('@/utils/wallet/watcher').WalletWatcher | null } **/
            $: markRaw({}),
            signer: markRaw({}),
            connectedWallet: null
        }),
        getters: {
            currentAccount(state) {
                return state.accountList[state.address]
            },
            cuttedAddress(state) {
                return cutEthAddress(state.address)
            },
            connected(state) {
                return !!state.address
            },
            isCorrectNetwork(state) {
                return state.chainId === CHAIN_ID
            }
        },
        actions: {
            /** @param {string} address **/
            add(address) {
                address = address.toLocaleLowerCase()
                this.accountList[address] = address
                this.address = address
            },
            clearStore() {
                this.accountList[this.address] = undefined
                this.address = null
                this.chainId = null
                this.$ = markRaw({})
                this.signer = markRaw({})
                this.connectedWallet = null
            },
            async tryDisconnect() {
                if (this.$?.connector?.disconnect) {
                    await this.$?.connector?.disconnect()
                    this.clearStore()
                    this.init()
                }
            },
            setChainId(chainId) {
                console.log('[Wallet Store] setChainId')
                this.chainId = Number(chainId)
            },
            setSigner(signer) {
                console.log('[Wallet Store] setSigner')
                this.signer = markRaw(signer)
            },
            createContract(contract) {
                if (!this.signer) return
                return new Contract(contract.address, contract.abi, this.signer)
            },
            createERC20(tokenAddress) {
                if (!this.signer) return
                return new Contract(tokenAddress, ERC20.abi, this.signer)
            },
            async init({ connector } = {}) {
                if (!connector) {
                    if (window?.ethereum?.selectedAddress) {
                        connector = new Metamask()
                    } else {
                        if (localStorage.getItem('walletconnect')) {
                            connector = new WalletConnect()
                        }
                    }
                }
                if (!connector) return

                if (!await this.handleWalletConnect(connector)) return
                this.setChainId(await this.$.chainIdNumber())
                if (this.connectedWallet === 'MetaMask') await this.switchNetwork()

                return await this.updateSigner()
            },
            async updateSigner() {
                console.info('[Wallet Store] updateWalletData start.')
                const { signer, signerAddress } = await this.$.getSigner()
                this.add(signerAddress)
                this.setSigner(signer)
                console.info('[Wallet Store] updateWalletData done.')
                return true
            },
            walletWatchCallback(...ev) {
                if (!ev) return
                console.log('[Wallet Store] Event: ', ev)
                const disconnect = findEvent(ev, 'disconnect')
                const accountsChanged = findEvent(ev, 'accountsChanged')
                const chainChanged = findEvent(ev, 'chainChanged')

                if (disconnect) this.clearStore()
                if (accountsChanged?.data?.length === 0) this.clearStore()
                else if (accountsChanged?.data?.length) this.add(accountsChanged.data[0])
                if (chainChanged) this.setChainId(chainChanged.data)
            },
            async handleWalletConnect(connector) {
                try {
                    console.info('[Wallet Store] Wallet connect start.')
                    this.$ = markRaw(await new WalletWatcher(connector).connect({ cb: this.walletWatchCallback }))
                    this.connectedWallet = ref(this.$?.connector?.label)
                } catch (connectErr) {
                    console.error('[Wallet Store] connectErr: ', connectErr)
                    /* global.$message.error(connectErr.message) */
                    return false
                }
                console.info('[Wallet Store] Wallet connect done.')
                return true
            },
            async switchNetwork() {
                try {
                    console.info('[Wallet Store] Chain switch start.')
                    if (this.$.chainIdNumber() !== CHAIN_ID) await this.$.switchNetwork()
                } catch (switchErr) {
                    console.error('[Wallet Store] switchErr: ', switchErr)
                    global.$message.error(switchErr.message)
                }
                console.info('[Wallet Store] Chain switch end.')
            },
            approveContract(contract, targetAllowance, {
                component,
                key,
                title,
                tokenDecimal,
                statusProps
            }) {
                if (!key) key = guid()
                if (!title) title = (t) => `Approvement: ${t}`
                if (!tokenDecimal) tokenDecimal = 6
                if (!statusProps) statusProps = 'approving'
                return new Promise(async (resolve, reject) => {
                    // Check allowance
                    const allowance = await contract['allowance'](this.address, CONTRACT_ADDRESS.TransferProxy)
                    /* console.log(key, allowance.toString(), targetAllowance.toString(), allowance.gte(targetAllowance)) */

                    // Check approvement
                    if (allowance.gte(targetAllowance)) {
                        return resolve(true)
                    }

                    // Approve if need
                    if (component) component[statusProps] = true
                    global.$notification.open({
                        message: title('Approving Required ❗'),
                        description:
                            'Your authorization is required to send the transaction, please go to your wallet to confirm...',
                        duration: 0,
                        key
                    })

                    try {
                        const approveTx = await contract['approve'](
                            CONTRACT_ADDRESS.TransferProxy,
                            addDecimal(calcApproveAmount(tokenDecimal), tokenDecimal).toString()
                        )
                        global.$notification.open({
                            message: title('Waiting for Approving...'),
                            description: WALLET_TIPS.txSend,
                            duration: 0,
                            key
                        })
                        await approveTx.wait().then((receipt) => {
                            console.log(`${key} Approving Error:`, receipt)
                            if (receipt.status === 1) {
                                global.$notification.open({
                                    message: title('Successful approve ✔️'),
                                    description: 'Successful approve.',
                                    duration: 0,
                                    key
                                })
                                if (component) component[statusProps] = false
                                return resolve(true)
                            }
                        })
                    } catch (err) {
                        console.error(`${key} Approving Error:`, err)
                        global.$notification.open({
                            message: title('Approving failed ❌'),
                            description: WALLET_ERRORS[err.code] || err.data?.message || err.message,
                            duration: 2,
                            key
                        })
                        if (component) component[statusProps] = false
                        return resolve(false)
                    }

                })
            },
            handleTranscation(transcationFactory, {
                component,
                key,
                title,
                statusProps,
                beforeStart,
                onStart,
                onComplete,
                onError,
                messages
            }) {
                if (!key) key = guid()
                if (!title) title = (t) => `Transcation: ${t}`
                if (!statusProps) statusProps = 'handling'
                messages = Object.assign(DEFAULT_TX_MESSAGES, messages || {})
                return new Promise(async (resolve, reject) => {
                    global.$notification.open({
                        message: title(messages.startTitle),
                        description: messages.startContent,
                        duration: 0,
                        key
                    })
                    if (component) component[statusProps] = true
                    try {
                        if (beforeStart) beforeStart(key)
                        const transcation = await transcationFactory()
                        global.$notification.open({
                            message: title(messages.waitingTitle),
                            description: messages.waitingContent,
                            duration: 0,
                            key
                        })
                        if (onStart) onStart(transcation)
                        await transcation.wait().then((receipt) => {
                            console.log(`${key} Tx receipt:`, receipt)
                            if (receipt.status === 1) {
                                global.$notification.open({
                                    message: title(messages.successTitle),
                                    description: messages.successContent,
                                    duration: 7,
                                    key
                                })
                                if (component) component[statusProps] = false
                                if (onComplete) onComplete(transcation, receipt)
                                return resolve({ status: 1, transcation, receipt, err: null })
                            }
                        })
                    } catch (err) {
                        console.error(`${key} Tx Error:`, err)
                        global.$notification.open({
                            message: title(messages.errorTitle),
                            description: messages.errorContent || WALLET_ERRORS[err.code] || 'Transcations Failed, please try again.',
                            duration: 2,
                            key
                        })
                        if (component) component[statusProps] = false
                        if (onError) onError(err)
                        return resolve({ status: -1, err })
                    }
                })
            },
            async approveAndSend({ handle, approveContract, approveChecker, component, transcationFactory, approveOptions, transcationOptions }) {
                const key = `${handle}-${guid()}`
                const title = (t) => `${handle}: ${t}`

                const aOptions = Object.assign({ component, key, title, tokenDecimal: component?.tokenDecimal }, approveOptions || {})
                if (!await this.approveContract(approveContract, approveChecker, aOptions)) {
                    return { status: -2 }
                }

                const tOptions = Object.assign({ component, key, title, }, transcationOptions || {})
                return await this.handleTranscation(transcationFactory, tOptions)
            },
            watchContractEvent(contract, event, callback) {
                contract.on(event, (...args) => {
                    let ev = args.slice(-1)
                    if (ev) ev = ev[0]
                    console.log(`${event} event:`, ev)
                    if (callback) callback(ev)
                })
            },
            async getLatestBlockTimestamp() {
                try {
                    const latestBlock = await this.signer.provider.getBlock()
                    return { timestamp: latestBlock.timestamp, status: true }
                } catch (err) {
                    return { timestamp: null, status: false }
                }
            }
        }
    })()
}