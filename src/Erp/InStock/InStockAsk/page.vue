<template>
  <view>
    <view class="selectOrder">
      <Card title="请选择采购订单" body-style="padding:0">
        <OrderList
            maxHeight="calc(100vh - 110px)"
            @onCheck="onCheck"
        />
      </Card>
    </view>
  </view>
</template>

<script>

import OrderList from "./components/OrderList";
import Card from "../../../components/Card";

export default {
  name: 'InStockAsk',
  components: {Card, OrderList},
  data() {
    return {}
  },
  methods: {
    onCheck(order) {
      uni.navigateTo({
        url:'/Erp/InStock/InStockAction/index',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('selectOrder', order)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.selectOrder {
  height: 100vh;
  background-color: #fff;
}
</style>
