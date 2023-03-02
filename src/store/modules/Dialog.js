
const init = {
    show:false
}

const state = () => ({...init})


const getters = {}


const actions = {

}


const mutations = {
    openChange(state, payload) {
        state.show = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
