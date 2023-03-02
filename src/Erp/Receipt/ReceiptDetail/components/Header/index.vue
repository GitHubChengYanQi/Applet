<template>
  <view>
    <view class="overview">
      <view class="headPortrait">
        <Avatar :src="avatar" :size="55" />
      </view>
      <view class="overviewText">
        <view class="boldTitle">{{ title || '' }}</view>
        <view class="batch">{{ coding || '' }}</view>
      </view>
      <view class="overviewInfo">
        <view class="state">•&nbsp;&nbsp;{{ statusName || '' }}</view>
        <view class="time">{{ MyDate.Show(createTime) }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {MyDate} from "../../../../../util/Tools";
import Avatar from "../../../../../components/Avatar";

export default {
  name: 'Header',
  components: {Avatar},
  props: ['title', 'coding', 'statusName', 'createTime', 'avatar', 'createName'],
  data() {
    return {
      MyDate
    }
  }
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
