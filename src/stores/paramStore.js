import { defineStore } from 'pinia'

export const useParamStore = defineStore('paramStore', {
    state: () => ({
        arenaNullsId: undefined,
        arenaNullsType: undefined,
        arenaNullsImg: undefined,
        arenaId: undefined,
        arenaTokenAddress: undefined,

        soldNullsType: undefined,
        soldNullsId: undefined,

        autoSelectNulls: false
    }),
    getters: {

    },
    actions: {

    }
})