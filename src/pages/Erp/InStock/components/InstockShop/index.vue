<template>
  <view>
    <Bouncing
        :bottom="150"
        bouncingId='waitInstock'
        @click="click"
        name="waitInstock"
        :size='24'
        :number='order.waitInStockNum || 0'
        :img='waitInstockShop'
    />
    <Bouncing
        :number='order.instockErrorNum'
        bouncingId='instockError'
        @click="click"
        name="instockError"
        :size='24'
        :img='instockErrorShop'
    />
  </view>
</template>


<script>
import Bouncing from "../../../../../components/Bouncing";
import instockErrorShop from '../../../../../static/instockErrorShop.png'
import waitInstockShop from '../../../../../static/waitInstockShop.png'

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
      instockErrorShop,
      waitInstockShop
    }
  },
  methods:{}
}
</script>

<style lang="scss">

</style>
