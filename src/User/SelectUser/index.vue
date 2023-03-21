<template>
  <Auth>

    <van-dialog id="van-dialog" />
    <Page
        v-if="auth"
        :checdUsers="checkUsers"
    />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  onLoad() {
    const curren = this
    const eventChannel = curren.getOpenerEventChannel();
    if (typeof eventChannel.on === "function") {
      eventChannel.on('clickDept', function (data) {
        curren.checkUsers = data.checkUsers || []
      })
    }
  },
  data() {
    return {
      checkUsers: []
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  },
  methods: {

  }
}
</script>
