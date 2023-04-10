import { MyEggs } from '@/backends/TypeDefine'
import { get } from '@/backends/base'



export default {
    /** 
     * @return {Promise<import('axios').AxiosResponse<MyEggs.getItemId>>}
     **/
    getItemId() {
        return get('pet/openEggBefer')
    }
}
