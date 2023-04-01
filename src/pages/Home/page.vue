<template>
  <view class="menus">
    <view class="title">
      常用功能
    </view>
    <uni-grid :column="3" :square="false" @change="change">
      <uni-grid-item v-for="(item, index) in Menu" :index="index" :key="index">
        <view class="grid-item-box">
          <Icon :icon="item.icon" :size="25" color="#007aff" />
          <text class="text">{{ item.name }}</text>
        </view>
      </uni-grid-item>
    </uni-grid>
  </view>
</template>

<script>
import {Menu} from "./menu";
import Icon from "../../components/Icon";

export default {
  name: 'Home',
  components: {Icon},
  data() {
    return {
      Menu
    }
  },
  mounted() {

  },
  methods: {
    change({detail: {index}}) {
      uni.navigateTo({
        url: Menu[index].url
      })
    }
  }
}
</script>

<style lang="scss">

.menus {
  margin: 12px;
  //background-color: #fff;

  .title {
    font-weight: bold;
    padding-bottom: 4px;
  }
}

.text {
  font-size: 14px;
  margin-top: 5px;
}



.grid-dynamic-box {
  margin-bottom: 15px;
}

.grid-item-box {
  flex: 1;

  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  background-color: #fff;
}

.grid-item-box-row {
  flex: 1;
  // position: relative;

  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}

.grid-dot {
  position: absolute;
  top: 5px;
  right: 15px;
}

.swiper {
  height: 420px;
}

</style>
