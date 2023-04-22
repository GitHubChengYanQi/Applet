<template>
  <view class="">
    <view class="tab">
      <view class="border" ></view>
      <u-tabs :list="tabs" @click="change" :scrollable="false"></u-tabs>
      <ByOrder v-if="current === 0" :checkedSkus="checkedSkus" @setCheckedSkus="(value)=>checkedSkus = value" />
      <ByPlan v-if="current === 1" :checkedSkus="checkedSkus" @setCheckedSkus="(value)=>checkedSkus = value" />
    </view>
    <view style="height: 100px"></view>
    <BottomButton
        only
        text="创建出库计划"
        @onClick="onClick"
    />

  </view>
</template>

<script>
import Check from "../../components/Check";
import ByOrder from "./components/ByOrder";
import ByPlan from "./components/ByPlan";
import BottomButton from "../../components/BottomButton";

export default {
  components: {BottomButton, ByPlan, ByOrder, Check},
  data() {
    return {
      item: ['', ''],
      checkedSkus: [],
      current: 0,
      tabs: [{
        name: '订单式生产',
        a:1
      }, {
        name: '计划式生产',
      }]
    };
  },
  methods: {
    change({index}) {
      this.checkedSkus = []
      this.current = index
    },
    onClick() {
      uni.navigateTo({
        url: '/Production/CreatePlan/index'
      })
    }
  }
};
</script>

<style lang="scss">
body {
  background-color: #e1ebf6;
}

image {
  width: 100%;
  height: 100%;
}

.space {
  height: 3px;
  background-color: #e1ebf6;
}

.tab {
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
}

.border {
  height: 1px;
  background-color: #e1ebf6;
}

.content {
  background-color: #fff;
}

.uni-list {
  padding: 5px 12px 0 12px;
}

.uni-list2 {
  display: flex;
  align-items: flex-end;
  padding-bottom: 5px;
  border-bottom: 1px solid #e1ebf6;
}

.uni-list3 {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.uni-list4 {
  display: flex;
  padding: 8px;
}

.uni-list5 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.uni-list6 {
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1ebf6;
}

.check {
  margin: auto 0;
}

.warn {
  color: #ff3141;
  font-size: 12px;
}

.number {
  font-size: 14px;
  padding: 2px 10px 0 0;
}

.time {
  font-size: 12px;
  color: #9d9d9d;
}

.headPortrait3 {
  width: 72px;
  height: 72px;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  .quantity {
    height: 16px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    color: #fff;
    position: absolute;
    bottom: 0;
    border-radius: 0 0 2px 2px;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.describe {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  justify-content: space-evenly;
  font-size: 14px;

  .grey {
    color: #808080;
  }
}

.button {
  width: 90%;
  margin: 0 auto;

}

.bottom {
  width: 100%;
  background-color: #fff;
  padding: 10px 0;
  position: absolute;
  bottom: 0;
}

.information {
  display: flex;
}

.title {
  width: 70px;
  color: #9d9d9d;
  font-size: 14px;
  padding: 1px 0;
  text-align-last: justify;
}

.content2 {
  flex-grow: 1;
}

.substance {
  font-size: 14px;
}

.center {
  text-align: center;
}
</style>
