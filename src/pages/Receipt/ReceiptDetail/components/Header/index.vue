<template>
  <view>
    <view class="overview">
      <view class="headPortrait">
        <img v-if="avatar" :src='avatar'>
        <view class="createName" v-else>{{ createName ? createName.substring(0, 1) : '' }}</view>
      </view>
      <view class="overviewText">
        <view class="boldTitle">{{ title || '' }}</view>
        <view class="batch">{{ coding || '' }}</view>
      </view>
      <view class="overviewInfo">
        <view class="state">•&nbsp;&nbsp;{{ statusName || '' }}</view>
        <view class="time">{{ createTime || '' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Header',
  props: ['title', 'coding', 'statusName', 'createTime', 'avatar', 'createName']
}
</script>

<style lang="scss">

image {
  width: 100%;
  height: 100%;
}

.overview {
  background-color: #fff;
  border-top: 1px solid #ccc;
  display: flex;
  padding: 12px;

  .overviewText {
    padding: 8px 10px 0 10px;
    flex-grow: 1;
  }

  .boldTitle {
    font-size: 14px;
    font-weight: bold;
  }

  .batch {
    font-size: 14px;
    padding-top: 8px;
  }

  .overviewInfo {
    text-align: right;
    padding: 8px 0;
  }

  .state {
    font-size: 14px;
    color: #2680eb;
  }

  .time {
    color: #808080;
    font-size: 14px;
    padding-top: 8px;
  }
}

.headPortrait {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
}

.createName {
  text-align: center;
  line-height: 55px;
}
</style>
