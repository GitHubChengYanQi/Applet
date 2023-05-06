<template>
  <Auth>
    <Page v-if="auth" />
<!--    <ImageCropper img-url="https://hunts-cnc.oss-cn-beijing.aliyuncs.com/upload/png/20230427/20230427806525.png?Expires=1683858898&OSSAccessKeyId=LTAI5tRtx3bPozdsUhbF6PS1&Signature=LyqUNczLM%2FqHqLe5PUShZ3tMFfU%3D" />-->
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import ImageCropper from "../../components/ImageCropper";

export default {
  components: {ImageCropper, Page, Auth},
  onPullDownRefresh() {
    console.log('refresh');
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  data() {
    return {}
  },
  async onShareAppMessage(res) {
    const tenant = this.$store.state.userInfo.tenant || {}
    return {
      title: tenant.name || '道昕云',
      path: '/pages/Home/index',
      imageUrl: tenant.imgLogo
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
