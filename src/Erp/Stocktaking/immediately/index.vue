<template>
  <view>
    <view class="white">
      <Search></Search>
      <view class="prompt">
        <view class="">

        </view>
        <view class="grey">
          请打开手机摄像头或使用手持终端扫描按键扫描库位码进行盘点
        </view>
      </view>
      <u-cell title="物料西区" :isLink="true" @click="onClick"></u-cell>
      <view class="">
        <Paging></Paging>
      </view>
    </view>
    <view class="bottomButton">
      <view class="icon">
        <u-icon name="scan" size='36px' color="#fff"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import Search from '../components/Search/index.vue'
import Paging from '../components/Paging/index.vue'

export default {
  components: {
    Search,
    Paging
  },
  methods: {
    onClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
.white {
  background-color: #fff;
}

.prompt {
  padding: 16px 10vw;
}

.grey {
  color: #878585;
  font-size: 14px;
}

.bottomButton {
  text-align: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #007AFF;
  position: absolute;
  bottom: 16px;
  left: calc(50% - 40px);
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 50px;
  padding: 22px;
}
</style>
