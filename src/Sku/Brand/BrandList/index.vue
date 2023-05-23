<template>
  <Auth>
    <Page
        v-if="auth"
        :type="type"
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
      checkBrands: []
    }
  },
  onLoad(option) {
    this.type = option.type // 选择用户
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
