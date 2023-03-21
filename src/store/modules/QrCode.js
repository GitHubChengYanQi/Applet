import {Message} from "../../components/Message";
import {QrCode} from "MES-Apis/lib/QrCode/promise";

const init = {type: '', result: {}, codeId: '', loading:false}

const state = () => ({...init})


const getters = {}


const actions = {
    scanCode({state}) {
        state.loading = true
        uni.scanCode({
            onlyFromCamera: true,
            success: async function (res) {
                const result = res.result
                const search = {}
                try {
                    const urlSearch = result.split('?')[1];
                    const params = urlSearch.split('&')
                    params.forEach(item => {
                        const value = item.split('=')
                        search[value[0]] = value[1]
                    })
                } catch (e) {

                }
                const codeId = search.id || result
                if (codeId) {
                    await QrCode.backObject({
                        params: {id: codeId}
                    }).then((res) => {
                        state.codeId = codeId
                        state.type = res.data.type
                        state.result = res.data.result
                    }).finally(()=>{
                        state.loading = false
                    })
                } else {
                    Message.toast('请扫描正确的二维码！')
                }
                state.loading = false

            },
            fail(res) {
                state.loading = false
                console.log(res)
            }
        });
    },
}


const mutations = {
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
