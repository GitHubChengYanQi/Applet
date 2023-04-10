<template>
  <view>
    <view class="extra">
      <u--input
          :placeholder="`请输入${stepItem.filedName || ''}`"
          @onChange="onChange"
          inputAlign="right"
          border="none"
      ></u--input>
    </view>
  </view>
</template>

<script>

export default {
  name: "DefaultInput",
  props: [
    'stepItem',
    'onClick',
    'onChange'
  ],
}
</script>

<style scoped>

</style>