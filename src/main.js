import Vue from 'vue'
import App from './App'
import axios from "axios";
import store from './store'

axios.defaults.adapter = function (config) {
    return new Promise((resolve, reject) => {
        const settle = require('axios/lib/core/settle');
        const buildURL = require('axios/lib/helpers/buildURL');
        uni.request({
            method: config.method.toUpperCase(),
            url: buildURL(config.url, config.params, config.paramsSerializer),
            header: config.headers,
            data: config.data,
            dataType: config.dataType,
            responseType: config.responseType,
            sslVerify: config.sslVerify,
            complete: function complete(response) {
                response = {
                    data: response.data,
                    status: response.statusCode,
                    errMsg: response.errMsg,
                    header: response.header,
                    config: config
                };

                settle(resolve, reject, response);
            }
        })
    })
}


const app = new Vue({
    ...App,
    store
})
app.$mount()
