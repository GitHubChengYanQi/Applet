<template>
  <view>
    <uni-section :title="title" type="line">
      <template v-slot:right>
        {{ extra || '' }}
        <slot name="extra"></slot>
      </template>
      <view class="content" v-if="$slots.default">
        <slot></slot>
      </view>
    </uni-section>
  </view>
</template>

<script>
export default {
  props: {
	  title:{
		  default:""
	  }, 
	  extra:String
	  },
  mounted() {
  }
}
</script>

<style lang="scss">
.content {
  padding: 0 16px 16px 16px;
}
</style>
