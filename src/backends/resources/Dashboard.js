import { Ring } from '@/backends/TypeDefine'
import { get } from '@/backends/base'


export default {
    /** 
    * Get the nulls for which the arena can be created
    * @param {{current: number, pageSize: number}} params
    * @return {Promise<import('axios').AxiosResponse<Ring.ringRecord>>}
    **/
    ringRecord(params) {
        return get('ringRecord/findPage', { params })
    },

    statistic(params) {
        return get('index/statistics', { params })
    }
}
