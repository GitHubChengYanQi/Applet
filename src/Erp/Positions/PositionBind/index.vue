<template>
  <Auth>
    <Page
        v-if="auth && show"
        :storehousePositionsId="storehousePositionsId"
        :position="position"
        :store="store"
        :positionBindSkus="positionBindSkus"
    />
  </Auth>
</template>
<script>
import Auth from '../../../components/Auth/index'
import Page from "./page";

export default {
  onLoad(options) {
    this.storehousePositionsId = options.storehousePositionsId
    this.position = options.position
    this.store = options.store
    const _this = this
    const eventChannel = this.getOpenerEventChannel();
    if (typeof eventChannel.on === "function") {
      eventChannel.on('positionBindSkus', function ({positionBindSkus}) {
        _this.positionBindSkus = positionBindSkus
      })
      _this.show = true
    } else {
      this.show = true
    }
  },
  components: {Page, Auth},
  data() {
    return {
      storehousePositionsId: '',
      position: '',
      store: '',
      show: false,
      positionBindSkus: []
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
