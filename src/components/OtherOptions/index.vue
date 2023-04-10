<template>
  <view>
    <view class="extra" @click="$emit('click')">
      <LinkButton :title="`请选择${stepItem.filedName || ''}`"/>
    </view>
  </view>
</template>

<script>
import LinkButton from "@/components/LinkButton/index.vue";

export default {
  name: "OtherOptions",
  components: {LinkButton},
  props: [
    'stepItem',
  ],
}
</script>

<style lang="scss">

.extra {
  color: #3D3D3D;
}
</style>