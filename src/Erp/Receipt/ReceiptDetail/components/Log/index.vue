<template>
  <view>
    <view v-if="type === ReceiptsEnums.instockOrder">
      <InStockLog instockOrderId={ToolUtil.isObject(detail.receipts).instockOrderId} />
    </view>
    <view v-else-if="type === ReceiptsEnums.outstockOrder">
      <OutStockLog :outstockOrderId='detail.receipts.pickListsId' />
    </view>
    <view v-else-if="type === ReceiptsEnums.stocktaking">
      <StocktaskingLog detail={detail.receipts} />
    </view>
    <view v-else-if="type === ReceiptsEnums.instockOrder">
      <MaintenanceLog detail={detail.receipts} />
    </view>
    <view v-else>
      <Empty description='暂无记录' />
    </view>
  </view>
</template>

<script>
import Empty from "../../../../../components/Empty";
import {ReceiptsEnums} from "../../../ReceiptsEnums";
import OutStockLog from "../../../../OutStock/OutStockLog";

export default {
  name: 'Log',
  components: {OutStockLog, Empty},
  props: ['type', 'detail'],
  data() {
    return {
      ReceiptsEnums
    }
  }
}
</script>
