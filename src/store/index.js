import Vue from 'vue'
import Vuex from 'vuex'
import bouncing from './modules/Bouncing'
import userInfo from './modules/UserInfo'
import shopNumber from './modules/ShopNumber'
import dialog from './modules/Dialog'
import systemInfo from './modules/SystemInfo'
import qrCode from './modules/QrCode'
import guide from './modules/Guide'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        bouncing,
        userInfo,
        shopNumber,
        dialog,
        systemInfo,
        qrCode,
        guide
    },
})
