<template>
  <view :class="['avatar',circular && 'circular']" :style="{width: `${size || 26}px`,height: `${size || 26}px`}">
    <image
        v-if="status === 'success' && src"
        :src="src"
        @error="error"
    />
    <van-icon v-else name="manager-o" />
  </view>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['size', 'src', 'circular'],
  data() {
    return {
      status: 'success'
    }
  },
  mounted() {

  },
  methods: {
    error() {
      this.status = 'error'
    }
  }
}
</script>

<style lang="scss">
.avatar {
  overflow: hidden;
  background-color: #eee;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  image {
    width: 100%;
    height: 100%;
  }
}

.circular {
  border-radius: 100%;
}
</style>
