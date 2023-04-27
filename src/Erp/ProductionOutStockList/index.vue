<template>
  <Auth>
    <Page v-if="auth && planId" :planId="planId" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth'
import Page from "./page";

export default {
  onLoad(options) {
    this.planId = options.planId
  },
  components: {Page, Auth},
  data() {
    return {
      planId: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
