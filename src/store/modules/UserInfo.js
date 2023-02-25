import {User} from "MES-Apis/src/User/promise";
import {Init} from "MES-Apis/src/Init";

const init = {
    auth: false,
    userInfo: {},
    publicInfo: {}
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
    clear(state) {
        state = {...init}
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
