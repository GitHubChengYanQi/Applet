<template>
  <Auth>
    <van-dialog id="van-dialog" />
    <Page v-if="auth" :list="list" />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {
      list:[]
    }
  },
  onLoad(){
    const _this = this;
    const eventChannel = this.getOpenerEventChannel();
    console.log(123);
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      _this.list = data;
      console.log(123,data)
    })
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
