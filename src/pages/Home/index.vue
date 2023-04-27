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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: '浑河工业',
        path: '/pages/Home/index',
        imageUrl: '../../static/images/logo.png'
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
