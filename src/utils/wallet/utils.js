import { WALLET_ERRORS } from './constants'


export const findEvent = (data, event) => {
    return data.find ? data.find(i => i.event === event) : undefined
}

/** 
 * @param {Error} err 
 * @returns {string | Error}
 **/
export const errInfo = (err) => {
    return WALLET_ERRORS[err?.code] || err.message
}


export const handleAddToken = async (type, options) => {
    try {
        const isSuccess = await window?.ethereum?.request({
            method: 'wallet_watchAsset',
            params: { type, options },
        });

        if (isSuccess) {
            console.log('Thanks for your interest:', type);
        } else {
            console.error('Your loss!');
        }
    } catch (error) {
        console.log(error);
    }
}


