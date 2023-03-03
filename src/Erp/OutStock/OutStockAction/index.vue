<template>
  <Auth>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
    <Page
        v-if="auth"
        @outStock="outStock"
    />
  </Auth>
</template>
<script>
import Auth from "../../../components/Auth";
import Page from "./page";

export default {
  components: {Page, Auth},
  data() {
    return {
      eventChannel: null
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  },
  methods: {
    outStock() {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel){
        eventChannel.emit('outStock');
      }
    }
  }
}
</script>
