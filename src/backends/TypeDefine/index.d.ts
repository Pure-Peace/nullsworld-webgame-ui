export declare class BaseResponse {
    code: number
    message: string
    data: any
}

export declare namespace MyNulls {
    export declare class list extends BaseResponse {
        data: {
            count: number,
            rows: [
                {
                    pet_id: number,
                    status: number,
                    owner_address: number,
                    type: number,
                    image: number,
                    create_time: number,
                    tx_hash: number,
                }
            ]
        }
    }

    export declare class findNullsPK extends BaseResponse {
        data: [
            {
                pet_id: number,
                status: number,
                owner_address: string,
                type: number,
                image: number,
                create_time: number,
                tx_hash: string,
            }
        ]
    }

    export declare class findNullsCreateArena extends BaseResponse {
        data: [
            {
                pet_id: number,
                status: number,
                owner_address: string,
                type: number,
                image: number,
                create_time: number,
                tx_hash: string,
            }
        ]
    }

    export declare class petDetail extends BaseResponse {
        data: {
            pet: {
                pet_id: number,
                status: number,
                owner_address: string,
                type: number,
                image: number,
                create_time: number,
                tx_hash: string,
            },
            sellRecord: [
                {
                    id: number,
                    pet_id: number,
                    pet_image: number,
                    buy_user_address: string,
                    sell_user_address: string,
                    price: number,
                    tx_hash: string,
                    create_time: number,
                    current: string,
                    current_contract: string,
                    current_precision: number,
                }
            ],
            ringRecord: [
                {
                    id: number,
                    ring_pet_id: number,
                    ring_address: string,
                    item_id: number,
                    challenger_pet_id: number,
                    challenger_address: string,
                    rv: string,
                    isWin: number,
                    create_time: number,
                    value: number,
                    tx_hash: string,
                    uuid: string,
                    token_name: string,
                    token: string,
                    token_precision: number,
                    tickets: number,
                }
            ]
        }
    }

}


export declare namespace MyEggs {
    export declare class getItemId extends BaseResponse {
        data: { item_id: number }
    }
}

export type ringItem = {
    item_id: number,
    owner_address: string,
    pet_id: number,
    initialCapital: number,
    token: string,
    multipe: number,
    max_jackpot: number,
    jackpot: number,
    count: number,
    backage_image: number,
    tickets: number,
    createTime: number,
    status: number,
    max_multipe: number,
}


export declare namespace Ring {
    export declare class createRing extends BaseResponse {
        data: { tx_hash: string }
    }

    export declare class findPage extends BaseResponse {
        data: {
            count: number,
            rows: [
                ringItem
            ]
        }
    }

    export declare class ringRecord extends BaseResponse {
        data:
            {
                count: number,
                rows: [
                    {
                        id: number,
                        ring_pet_id: number,
                        ring_address: string,
                        item_id: number,
                        challenger_pet_id: number,
                        challenger_address: string,
                        rv: string,
                        isWin: number,
                        create_time: number,
                        value: number,
                        tx_hash: string,
                    }
                ]
            }
    }

    export declare class getRingById extends BaseResponse {
        data: ringItem
    }

    export declare class myCombatResults extends BaseResponse {
        data: {
            count: number,
            rows: [
                {
                    id: number,
                    ring_pet_id: number,
                    ring_address: string,
                    item_id: number,
                    challenger_pet_id: number,
                    challenger_address: string,
                    rv: string,
                    isWin: number,
                    create_time: number,
                    value: number,
                    tx_hash: string,
                    uuid: string,
                    token_name: string,
                    token: string,
                    token_precision: number,
                    tickets: number,
                }

            ]
        }
    }
}


export declare namespace Trading {
    export declare class transactionRecord extends BaseResponse {
        data:
            {
                count: number,
                rows: [
                    {
                        id: number,
                        pet_id: number,
                        pet_image: number,
                        buy_user_address: string,
                        sell_user_address: string,
                        price: number,
                        tx_hash: string,
                        create_time: number,
                        current: string,
                        current_contract: string,
                    }
                ]
            }
    }

    export declare class marketPage extends BaseResponse {
        data: {
            count: number,
            rows: [
                {
                    pet_id: number,
                    current: string,
                    current_contract: string,
                    price: number,
                    type: number,
                    image: number,
                }
            ]
        }
    }

    export declare class petDetail extends BaseResponse {
        data: {
            petSell: {
                id: number,
                pet_id: number,
                pet_image: number,
                current: string,
                current_contract: string,
                price: number,
                sell_account: string,
                create_time: number,
                status: number,
                tx_hash: string,
            },
            transaction: [
                {
                    id: number,
                    pet_id: number,
                    pet_image: number,
                    buy_user_address: string,
                    sell_user_address: string,
                    price: number,
                    tx_hash: string,
                    create_time: number,
                    current: string,
                    current_contract: string,
                }
            ]
        }
    }

    export declare class findSellByAddress extends BaseResponse {
        data: {
            count: number,
            rows: [
                {
                    id: number,
                    pet_id: number,
                    pet_image: number,
                    buy_user_address: string,
                    sell_user_address: string,
                    price: number,
                    tx_hash: string,
                    create_time: number,
                    current: string,
                    current_contract: number,
                    current_precision: number,
                }
            ]
        }
    }
}
