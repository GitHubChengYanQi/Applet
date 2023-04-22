<template>
  <Auth>
    <Page v-if="auth && storehouseId" :storehouseId="storehouseId" :storehousePositionsId="storehousePositionsId" />

  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(options) {
    this.storehouseId = options.storehouseId
    this.storehousePositionsId = options.storehousePositionsId
  },
  components: {Page, Auth},
  data() {
    return {
      storehouseId: '',
      storehousePositionsId: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
