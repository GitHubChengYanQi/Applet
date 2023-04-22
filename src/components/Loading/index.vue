<template>
  <view>
    <view v-if="skeleton" class="skeletonLoading">
      <u-loading-page
          v-if="skeletonType === 'page'"
          :loading-text="loadingText || 'loading...'"
          loading
      />
      <u-loading-icon v-else mode="circle" :text="loadingText || 'loading...'" :vertical="true"></u-loading-icon>
    </view>
    <view v-if="loading" class="loading">
      <u-loading-page
          loadingMode="spinner"
          iconSize="34"
          loadingColor="#fff"
          color="#fff"
          bg-color="rgba(0, 0, 0, 0.3)"
          loading
      />
    </view>
  </view>
</template>

<script>

export default {
  name: 'loading',
  props: ['title', 'loading', 'skeleton', 'skeletonType', 'loadingText'],
}
</script>

<style lang="scss">

.my-custom-class {
  width: auto !important;
  padding: 24px;
  text-align: center;
  background-color: rgba(0, 0, 0, 2.3) !important;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  gap: 4px;
}

.skeletonLoading {
  padding: 24px;
  text-align: center;
}

.loading {
  > view {
    z-index: 9999;
  }
}

</style>
