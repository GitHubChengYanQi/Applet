<template>
  <Auth>
    <ReceiptList v-if="auth" />
  </Auth>
</template>
<script>
import Auth from "../../../components/Auth";
import ReceiptList from "./page";

export default {
  components: {ReceiptList, Auth},
  data() {
    return {}
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  }
}
</script>
