<template>
  <Auth>
    <van-notify id="van-notify" />

    <van-dialog id="van-dialog" />
    <Page v-if="auth && taskId" :taskId="taskId" />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";
import {Message} from "../../../components/Message";

export default {
  components: {Page, Auth},
  onLoad(options) {
    this.taskId = options.taskId || '1631120335069003777'
  },
  data() {
    return {
      taskId: null
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
