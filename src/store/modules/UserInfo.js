import {User} from "MES-Apis/src/User/promise";
import {Init} from "MES-Apis/src/Init";

const init = {
    auth: false,
    userInfo: {},
    publicInfo: {},
    refresh: false
}

const state = () => ({...init})


const getters = {}


const actions = {
    async getUserInfo({state}) {
        if (Object.keys(state.userInfo).length === 0) {
            const userRes = await User.getUserInfo()
            state.userInfo = userRes.data || {}
        }
    },
    async getPublicInfo({state}) {
        if (Object.keys(state.publicInfo).length === 0) {
            const publicInfo = await Init.getPublicInfo()
            state.publicInfo = publicInfo.data || {}
        }
    }
}


const mutations = {
    authStatus(state, payload) {
        state.auth = payload
    },
    refresh(state, payload) {
        state.refresh = payload
    },
    clear(state) {
        Object.keys(init).forEach((key)=>{
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
