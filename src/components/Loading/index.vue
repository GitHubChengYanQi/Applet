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
    <view v-if="loading">
      <van-dialog
          use-slot
          show
          :show-confirm-button="false"
          :overlay="false"
          custom-class="my-custom-class"
      >
        <view class="content">
          <van-loading type="spinner" color="#fff" :size="50" />
          加载中...
        </view>
      </van-dialog>
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

</style>
