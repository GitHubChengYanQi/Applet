<template>
  <Auth>
    <Page v-if="auth" :storehouseId="id" />

  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(option) {
    this.id = option.id
  },
  components: {Page, Auth},
  data() {
    return {
      id: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
