<template>
  <view class="back" :style="{paddingBottom:padding}">
    <view class="list" v-for="(item,index) in list" :key="index">
      <SkuItem  :skuResult="item.skuResult"></SkuItem>
      <view class="input">
        <span>到货数</span>
        <view class="keybord" @click="keybord(index,submitList[index].num)">×{{ submitList[index].num }}</view>
      </view>
    </view>
    <view class="button" :style="{paddingBottom:bottom}">
      <u-button type="primary" text="确定" shape="circle" @click="submit"></u-button>
    </view>
    <Keybord :visible="show" @visiblChange="visiblChange" @onChange="onChange" :value="editNum"></Keybord>
  </view>
</template>
<script>
import SkuItem from "@/components/SkuItem";
import Keybord from "@/components/Keybord";
import {Order} from "MES-Apis/lib/Order/promise";

export default {
  components: {
    SkuItem,
    Keybord
  },

  props: ['orderId'],

  data() {
    return {
      bottom: 0,
      padding: 0,
      show: false,
      list: [],
      submitList: [],
      editNum: 0,
      editIndex: -1
    }
  },
  mounted() {
    const _this = this;
    uni.getSystemInfo({
      success: function (res) {
        _this.bottom = res.safeAreaInsets.bottom + 'px';
        _this.padding = (50 + res.safeAreaInsets.bottom) + 'px';
      }
    });
    this.get();
  },
  methods: {
    /**
     * 请求接口获取数据
     */
    get() {
      Order.detail(this.orderId, {}).then(response => {
        console.log(response.data);
        this.list = response.data.detailResults;
        this.submitList = response.data.detailResults.map(item => {
          return {
            skuId: item.skuId,
            brand: item.brandId,
            num: item.purchaseNumber
          }
        })
      })

      // this.list = [...tmpList];

    },
    keybord(index, num) {
      this.editNum = num;
      this.editIndex = index;
      this.show = true
    },
    visiblChange(v) {
      this.show = v;
      this.editNum = 0;
      this.editIndex = -1;
    },
    onChange(num) {
      this.submitList[this.editIndex].num = num;
      console.log(num)
    },
    submit(){
      console.log(this.submitList)
    }
  }
}
</script>

<style scoped>

.list {
  padding: 12px;
  margin-top: 8px;
  background-color: #FFFFFF;
  position: relative;
}

.button {
  background-color: #FFFFFF;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  z-index: 999;
}

.input {
  font-size: 14px;
  line-height: 22px;
  position: absolute;
  top: 18px;
  right: 8px;
  width: 50px;
  max-width: 100px;
  text-align: center;
}

.keybord {
  border: 1px solid #D9D9D9;
  padding: 0 8px;
  text-align: center;
  margin-top: 8px;
}
</style>