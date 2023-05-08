<template>
  <view>
    <Bouncing
        :bottom="150"
        bouncingId='waitInstock'
        @click="click"
        name="waitInstock"
        :size='24'
        :number='order.waitInStockNum || 0'
        :img='erp_waitInstockShop'
    />
    <Bouncing
        :number='order.instockErrorNum'
        bouncingId='instockError'
        @click="click"
        name="instockError"
        :size='24'
        :img='erp_instockErrorShop'
    />
  </view>
</template>


<script>
import Bouncing from "../../../../components/Bouncing";

import {erp_instockErrorShop} from "../../../../images/erp/instockErrorShop";
import {erp_waitInstockShop} from "../../../../images/erp/waitInstockShop";

export default {
  name: 'InstockShop',
  components: {Bouncing},
  props: [
    'actionId',
    'instockOrderId',
    'order',
  ],
  mounted() {

  },
  data() {
    return {
      erp_instockErrorShop,
      erp_waitInstockShop
    }
  },
  methods:{}
}
</script>

<style lang="scss">

</style>
