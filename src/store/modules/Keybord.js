
const init = {
    keyboardHeight:0,
}

const state = () => ({...init})


const getters = {}


const actions = {

}


const mutations = {
    keyboardHeightChange(state, payload) {
        state.keyboardHeight = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
