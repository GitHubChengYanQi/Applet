<template>
  <Auth>
    <Page
        v-if="auth"
        :type="type"
        :id="id"
        :default-checd-brands="checkBrands"
    />
  </Auth>
</template>
<script>

import Page from "./page";
import Auth from "@/components/Auth";

export default {
  components: {Auth, Page},
  data() {
    return {
      type: '',
      id: '',
      checkBrands: []
    }
  },
  onLoad(option) {
    this.type = option.type
    this.id = option.id
    const _this = this
    const eventChannel = _this.getOpenerEventChannel();
    if (typeof eventChannel.on === "function") {
      eventChannel.on('checkBrands', function (data) {
        _this.checkBrands = data.checkBrands || []
      })
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>

<style lang="scss">

</style>
