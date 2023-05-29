<template>
  <Auth>
    <Page
        v-if="auth && storehouseId && pid"
        :storehouseId="storehouseId"
        :storehousePositionsId="storehousePositionsId"
        :pid="pid"
        :store="store"
    />
    <Empty v-else description="缺少参数" />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";
import Empty from "../../../components/Empty";

export default {
  onLoad(options) {
    this.storehouseId = options.storehouseId
    this.storehousePositionsId = options.storehousePositionsId
    this.pid = options.pid
    this.store = options.store
  },
  components: {Empty, Page, Auth},
  data() {
    return {
      storehouseId: '',
      storehousePositionsId: '',
      pid: '',
      store: ''
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
