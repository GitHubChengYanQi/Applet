<template>
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
</template>

<script>

export default {
  name: 'loading',
  props: ['title', 'loading'],
}
</script>

<style lang="scss">

.my-custom-class {
  width: auto !important;
  padding: 24px;
  text-align: center;
  background-color: rgb(0 0 0 / 23%) !important;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  gap: 4px;
}

</style>
