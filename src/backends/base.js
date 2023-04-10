import axios from '@/utils/axios'


export const BASE_API = 'https://nulls-world-api.vercel.app/api/' //import.meta.env.VUE_APP_API_BASE


/**
 * @param {string} url
 * @param {import('axios').AxiosRequestConfig?} config
 * @return {Promise<import('axios').AxiosResponse<any>>}
 **/
export const get = (url, config) => {
    return axios.get(`${BASE_API}${url}`, config)
}


/**
 * @param {string} url
 * @param {import('axios').AxiosRequestConfig?} config
 * @return {Promise<import('axios').AxiosResponse<any>>}
 **/
export const post = (url, config) => {
    return axios.post(`${BASE_API}${url}`, config)
}


export { axios }
