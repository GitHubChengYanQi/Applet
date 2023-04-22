import {User} from "MES-Apis/lib/User/promise";
import {Init} from "MES-Apis/lib/Init";

const init = {
    auth: false,
    userInfo: {},
    tenant: {},
    publicInfo: {},
    refresh: false
}

const state = () => ({...init})


const getters = {}


const actions = {
    async getPublicInfo({state}) {
        if (Object.keys(state.publicInfo).length === 0) {
            const publicInfo = await Init.getPublicInfo({})
            state.publicInfo = publicInfo.data || {}
        }
    }
}


const mutations = {
    authStatus(state, payload) {
        state.auth = payload
    },
    setUserInfo(state, payload) {
        state.userInfo = payload
    },
    setTenant(state, payload) {
        state.tenant = payload
    },
    refresh(state, payload) {
        state.refresh = payload
    },
    clear(state) {
        Object.keys(init).forEach((key) => {
            state[key] = init[key]
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
