<template>
  <Auth>
    <Page v-if="auth && show" :storeId="storeId"/>
  </Auth>
</template>
<script>
import Page from "./page.vue";
import Auth from "@/components/Auth/index.vue";

export default {
  onLoad(options) {
    this.storeId = options.storeId
    this.show = true
  },
  components: {Page, Auth},
  data() {
    return {
      storeId: null,
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