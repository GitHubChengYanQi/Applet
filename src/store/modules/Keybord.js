const init = {
    keyboardHeight: 0,
    numberKeyboardShow: false,
}

const state = () => ({...init})


const getters = {}


const actions = {}


const mutations = {
    keyboardHeightChange(state, payload) {
        state.keyboardHeight = payload
    },
    numberKeyboardChange(state, payload) {
        state.numberKeyboardShow = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
