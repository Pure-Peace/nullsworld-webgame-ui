import _ERC20 from './abi/ERC20.json'

// Nulls
import _NullsEggManager from './abi/NullsEggManager.json'
import _NullsEggToken from './abi/NullsEggToken.json'
import _NullsRankManager from './abi/NullsRankManager.json'
import _NullsWorldCore from './abi/NullsWorldCore.json'
import _NullsPetToken from './abi/NullsPetToken.json'


const contractAbiWithAddress = (name) => {
    return { address: CONTRACT_ADDRESS[name], ...contractJson(name) }
}


export const contractJson = (name) => {
    return CONTRACTS[`_${name}`]
}


export const CONTRACTS = {
    _ERC20,
    _NullsEggManager,
    _NullsEggToken,
    _NullsRankManager,
    _NullsWorldCore,
    _NullsPetToken
}

export const CONTRACT_ADDRESS = {
    NullsEggManager: '0xa81d1B2D581804B3798A38292C7d3ED2f321eEEd',
    NullsEggToken: '0xD84Cb399E980a5E9A08A0dA0268dFdC0af7f07E2',
    NullsRankManager: '0xF93a30577Ba30d7Cf73A4081f8cf52b3FD3EB84d',
    NullsWorldCore: '0x554E8761dbD83C118B522319F882e0ba13D4B4B2',
    NullsPetToken: '0x32070ce9af1B0CB8e3d07DeE278F5fFc22E5Fdb7',
    TransferProxy: '0x3Cc1Ad4766c8b4D8a21B233Bae4Ef55c30139Ebd'
}

export const ERC20_ADDRESS = {
    USDT: '0x04F535663110A392A6504839BEeD34E019FdB4E0',
    'T-NET': '0x6aA7CF4F83c6a88cABD93b40D47E7144311882B8'
}

export const getContractAddress = (contract) => {
    return CONTRACT_ADDRESS[contract]
}

export const getERC20ContractAddress = (contract) => {
    return ERC20_ADDRESS[contract]
}

export const NullsEggManager = contractAbiWithAddress('NullsEggManager')
export const NullsEggToken = contractAbiWithAddress('NullsEggToken')
export const NullsRankManager = contractAbiWithAddress('NullsRankManager')
export const NullsWorldCore = contractAbiWithAddress('NullsWorldCore')
export const NullsPetToken = contractAbiWithAddress('NullsPetToken')


// ERC20
export const ERC20 = {
    /** Get ERC20 token contract address with token symbol */
    getAddress(symbol) {
        return ERC20_ADDRESS[symbol]
    },
    ..._ERC20
}
