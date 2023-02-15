<template>
  <view>
    <view v-if="success">
<!--      <slot></slot>-->
    </view>
    <view v-else-if="error">
      初始化失败！
    </view>
    <view v-else class="loading">
      系统正在初始化,请稍后...
    </view>
  </view>
</template>

<script>

import {Init} from "MES-Apis/src/Init";
import {User} from "MES-Apis/src/User";
import Loading from "../Loading";
import {getLocalParmas} from "../../util/Tools";

export default {
  components: {Loading},
  data() {
    return {
      success: false,
      error: false,
    }
  },
  async mounted() {

    Init.initBaseURL('http://192.168.2.111')

    Init.responseConfig({
      loginTimeOut: (res) => {
        uni.redirectTo({
          url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
        })
      },
      errorMessage: (res) => {

      },
    })

    const publicInfo = await Init.getPublicInfo({
      onError: () => {
        this.error = true
      }
    })
    if (!publicInfo) {
      this.error = true
      return
    }
    getApp().globalData.publicInfo = publicInfo.data
    const token = getApp().globalData.token


    if (token) {
      this.getUserInfo()
    } else {
      uni.redirectTo({
        url: `/pages/login/index?backUrl=${getLocalParmas().route}`,
      })
    }
  },
  methods: {
    async getUserInfo() {
      const res = await User.getUserInfo({
        onSuccess: (res) => {
          // this.success = true
        },
      })
    }
  }
}

</script>

<style lang="scss">
.loading {
  text-align: center;
  padding: 10vh;
}
</style>
