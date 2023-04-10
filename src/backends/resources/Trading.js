import { Trading } from '@/backends/TypeDefine'
import { get } from '@/backends/base'



export default {
    /** 
     * @param {{current: number, pageSize: number}} params
     * @return {Promise<import('axios').AxiosResponse<Trading.transactionRecord>>}
     **/
    transactionRecord(params) {
        return get('petSell/findPetTransactionPage', { params })
    },

    /** 
     * @param {{current: number, pageSize: number, type: 0 | 1 | 2}} params
     * @return {Promise<import('axios').AxiosResponse<Trading.marketPage>>}
     **/
    marketPage(params) {
        return get('petSell/findPage', { params })
    },

    /** 
     * @param {{id: number}} params
     * @return {Promise<import('axios').AxiosResponse<Trading.petDetail>>}
     **/
    petDetail(params) {
        return get('petSell/findDetails', { params })
    },

    /** 
     * @param {{address: string, current: number, pageSize: number}} params
     * @return {Promise<import('axios').AxiosResponse<Trading.findSellByAddress>>}
     **/
    findSellByAddress(params) {
        return get('petSell/findSellByAddress', { params })
    }
}
