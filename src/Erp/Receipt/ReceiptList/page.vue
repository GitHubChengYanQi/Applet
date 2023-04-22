<template>
  <view class='process'>
    <view class='content'>
      <Create v-if="active === 'create'" />
      <MyAudit v-if="active === 'audit'" :taskSkuId='taskSkuId' :type="type" />
      <MyAudit v-if="active === 'start'" :createUser='userId' />
    </view>
    <BottomButton
        v-if="type === ReceiptsEnums.outstockOrder"
        text="出库确认"
        only
        @onClick="onClick"
    />
  </view>
</template>

<script>
import MyAudit from "./components/MyAudit";
import {getLocalParmas} from "../../../util/Tools";
import Loading from "../../../components/Loading";
import Avatar from "../../../components/Avatar";
import BottomButton from "../../../components/BottomButton";
import {ReceiptsEnums} from '../ReceiptsEnums'
import Icon from "../../../components/Icon";

export default {
  props: ['receiptType'],
  name: 'ReceiptList',
  components: {Icon, BottomButton, Avatar, Loading, MyAudit},
  data() {
    return {
      active: 'audit',
      taskSkuId: '',
      userId: '',
      loading: true,
      type: '',
      ReceiptsEnums
    }
  },
  mounted() {
    const type = this.receiptType
    this.type = type
    let title = ''
    switch (type) {
      case ReceiptsEnums.outstockOrder:
        title = '出库列表'
        break;
      case ReceiptsEnums.instockOrder:
        title = '入库列表'
        break;
    }
    uni.setNavigationBarTitle({
      title
    });
  },
  methods: {
    onClick() {
      uni.navigateTo({
        url: '/Erp/OutStock/OutStockConfirm/index'
      })
    }
  }
}
</script>

<style lang="scss">
.process {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100vh;

  .content {
    flex-grow: 1;
    overflow: auto;
  }

}

</style>
