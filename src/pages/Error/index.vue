<template>
  <view class="error">
    <Empty
        type="error"
        description="系统初始化失败！请联系管理员。"
    />
    <MyButton type="primary" @click="refresh">刷新</MyButton>
  </view>
</template>
<script>
import Empty from "../../components/Empty";
import MyButton from "../../components/MyButton";
import {getLocalParmas} from "../../util/Tools";

export default {
  name: 'Error',
  components: {MyButton, Empty},
  methods: {
    refresh() {
      uni.reLaunch({
        url: getLocalParmas().route,
      });
    }
  },
  mounted() {
    // uni.showTabBar()
  }
}
</script>

<style lang="scss">
.error {
  background-color: #fff;
  height: 80vh;
  padding-top: 20vh;
  text-align: center;
}
</style>
