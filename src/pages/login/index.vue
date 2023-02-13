<template>
  <view>
  
  </view>
</template>
<script>
import graceChecker from "../../common/graceChecker.js"
import {login} from "MES-Apis/src/Login/promise";


export default {
  mounted() {
    const pages = getCurrentPages();
    this.backUrl = pages[pages.length - 1]?.options?.backUrl
  },
  data() {
    return {
      username: 'admin ',
      password: '111111',
      backUrl: '',
    }
  },
  methods: {
    formSubmit: function (e) {
      //定义表单规则
      // var rule = [{
      //   name: "username",
      //   checkType: "string",
      //   checkRule: "1,3",
      //   errorMsg: "姓名应为1-3个字符"
      // },
      //   {
      //     name: "password",
      //     checkType: "string",
      //     checkRule: "4,6",
      //     errorMsg: "密码应为4-6个字符"
      //   }
      // ];
      //进行表单检查
      var formData = e.detail.value;
      var checkRes = graceChecker.check(formData, []);
      if (checkRes) {
        this.requestPromise();
      } else {
        uni.showToast({
          title: graceChecker.error,
          icon: "none"
        });
      }
    },
    formReset: function (e) {

    },
    requestPromise() {
      login({
        username: this.username,
        password: this.password
      }, {
        onSuccess: (res) => {
          getApp().globalData.token = res
          uni.redirectTo({
            url: this.backUrl,
          })
        },
        onError: () => {
          uni.showToast({
            title: '失败',
          });
        }
      })
    }
  },
}
</script>

<style>
.uni-form-item .title {
  padding: 20px 0;
}
</style>
