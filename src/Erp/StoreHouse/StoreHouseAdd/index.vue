<template>
  <Auth>
    <Page v-if="auth && show" :storehouseId="id" :pid="pid" />

  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(option) {
    this.show = true
    this.id = option.id
    this.pid = option.pid
  },
  components: {Page, Auth},
  data() {
    return {
      id: '',
      pid: '',
      show: false
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
