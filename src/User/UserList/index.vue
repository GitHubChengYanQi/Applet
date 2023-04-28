<template>
  <Auth>
    <Page
        v-if="auth"
        :checdUsers="checkUsers"
        :type="type"
        :show="show"
    />
  </Auth>
</template>
<script>
import Auth from '../../components/Auth/index'
import Page from "./page";
import {getLocalParmas} from "../../util/Tools";

export default {
  components: {Page, Auth},
  onLoad(option) {
    uni.enableAlertBeforeUnload({
      message: '请您填写数据',
      success:()=>{}
    })
    this.type = option.type
    this.show = !option.type
    const curren = this
    const eventChannel = curren.getOpenerEventChannel();
    if (typeof eventChannel.on === "function") {
      eventChannel.on('checkUsers', function (data) {
        curren.checkUsers = data.checkUsers || []
      })
    }
  },
  data() {
    return {
      checkUsers: [],
      type: '',
      show: false,
    }
  },
  computed: {
    auth() {
      return this.$store.state.userInfo.auth
    }
  },
  methods: {}
}
</script>
