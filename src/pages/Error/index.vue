<template>
  <view>
    <Empty type="error" description="系统初始化失败！请联系管理员。" />
  </view>
</template>
<script>
import Empty from "../../components/Empty";

export default {
  name: 'Error',
  components: {Empty},
  methods: {}
}
</script>
