import { Ring } from '@/backends/TypeDefine'
import { get, post } from '@/backends/base'



export default {
    /** 
     * Create ring
     * @param {{owner_address: string, pet_id: number, token: string, multiple: number, r: string, s: string, v: string}} params
     * @return {Promise<import('axios').AxiosResponse<Ring.createRing>>}
     **/
    createRing(data) {
        return post('ring/createRing', data)
    },

    /** 
     * Get ring list
     * @param {{status?: 1 | 2, current: number, pageSize: number, number?: number}} params
     * @return {Promise<import('axios').AxiosResponse<Ring.findPage>>}
     **/
    findPage(params) {
        return get('ring/findPage', { params })
    },

    /** 
     * @param {{id: number}} params
     * @return {Promise<import('axios').AxiosResponse<Ring.getRingById>>}
     **/
    getRingById(params) {
        return get('ring/findById', { params })
    },


    /** 
     * @param {{id: number}} params
     * @return {Promise<import('axios').AxiosResponse<any>>}
     **/
    getCombatResult(params) {
        return get('ringRecord/findById', { params })
    },

    /** 
     * @param {{address: string, type: number, pageSize: number, current: number}} params
     * @return {Promise<import('axios').AxiosResponse<Ring.myCombatResults>>}
     **/
    myCombatResults(params) {
        return get('ringRecord/findByAddress', { params })
    }

}
