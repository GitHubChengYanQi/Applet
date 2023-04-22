<template>
  <Auth>


    <Page v-if="auth && bomId" :bomId="bomId" />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";

export default {
  components: {Page, Auth},
  onLoad(options) {
    this.bomId = options.bomId
  },
  data() {
    return {
      bomId: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
