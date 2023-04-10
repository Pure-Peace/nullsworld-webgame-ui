export const CHAIN_ID = 256
export const CHAIN_ID_HEX = `0x${CHAIN_ID.toString(16)}`
export const CHAIN_PARAMS = [{
    chainId: CHAIN_ID_HEX,
    chainName: 'Huobi ECO Chain Testnet',
    nativeCurrency: {
        name: 'HT',
        symbol: 'HT',
        decimals: 18
    },
    rpcUrls: ['https://http-testnet.hecochain.com/'],
    blockExplorerUrls: ['https://testnet.hecoinfo.com/']
}]
export const CHAIN_RPC_MAP = {
    256: 'https://http-testnet.hecochain.com/'
}


export const WALLET_ERRORS = {
    4001: 'You have manually rejected this transaction.'
}

export const WALLET_TIPS = {
    txSend: 'The transaction has been sent, please wait for the result...'
}

export const DEFAULT_TX_MESSAGES = {
    startTitle: 'Sending Transcations 📑',
    startContent: 'Awaiting approval of transactions...',
    waitingTitle: 'Waiting for Transcations result 📑',
    waitingContent: 'The transactions has been sent, please wait for the result...',
    successTitle: 'Transcations Success ✔️',
    successContent: 'Transcations Success',
    errorTitle: 'Transcations failed ❌',
    errorContent: ''
}
