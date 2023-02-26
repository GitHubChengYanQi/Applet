
const init = {
    open:false
}

const state = () => ({...init})


const getters = {}


const actions = {

}


const mutations = {
    openChange(state, payload) {
        state.open = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
