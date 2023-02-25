<template>
  <Auth>
    <van-notify id="van-notify" />
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
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
