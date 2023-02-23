<template>
  <view :style="{height:auditNode && detail.permissions && '84px'}">
    <view v-if='auditNode && detail.permissions' class='bottom'>
      <ActionButtons
          :taskDetail='detail'
          @refresh="$emit('refresh')"
          :taskId='detail.processTaskId'
          :logIds='logIds'
          :createUser='detail.type === this.ReceiptsEnums.error ? null : detail.createUser'
          :permissions='detail.permissions'
          @onClick="onClick"
          :actions='actions'
      />
    </view>
    <Loading :loading="loading" />
  </view>
</template>

<script>
import ActionButtons from '../../../ActionButtons'
import {ReceiptsEnums} from "../../../../../ReceiptsEnums";
import {Process} from "MES-Apis/src/Process/promise";
import Loading from '../../../../../../../components/Loading'
import {Message} from "../../../../../../../components/Message";


export default {
  components: {ActionButtons, Loading},
  props: ['version', 'currentNode', 'detail', 'refresh'],
  data() {
    return {
      loading: false,
      auditNode: false,
      logIds: [],
      actions: [
        {name: '同意', action: 'ok'},
        {name: '驳回', action: 'no'},
      ]
    }
  },
  mounted() {
    const logIds = [];
    let auditNode = false;
    this.currentNode.forEach((item) => {
      if (item.stepType === 'audit' && !auditNode) {
        auditNode = true;
      }

      if (!this.version) {
        const logResult = item.logResult || {};
        logIds.push(logResult.logId);
      } else {
        const logResults = item.logResults || [];
        logResults.map(item => {
          logIds.push(item.logId);
        });
      }
    });
    this.auditNode = auditNode
    this.logIds = logIds
  },
  methods: {
    audit(status) {
      this.loading = true
      Process.auditPost({
        taskId: this.detail.processTaskId,
        logIds: this.logIds,
        status,
      }).then(() => {
        Message.successToast('审批成功！', () => {
          this.$emit('refresh')
        }, true)
      }).finally(() => {
        this.loading = false
      })
    },
    onClick(action) {
      switch (action) {
        case 'ok':
          this.audit(1);
          break;
        case 'no':
          this.audit(0);
          break;
        case 'revokeAndAsk':
          this.revoke();
          break;
        default:
          break;
      }
    },
    revoke() {
      switch (this.detail.type) {
        case ReceiptsEnums.instockOrder:
          // InStockRevoke(detail);
          break;
        case ReceiptsEnums.outstockOrder:
          // OutStockRevoke(detail);
          break;
        case ReceiptsEnums.allocation:
          // AllocationRevoke(detail);
          break;
        case ReceiptsEnums.stocktaking:
          // StocktakingRevoke(detail);
          break;
        case ReceiptsEnums.maintenance:
          // MaintenanceRevoke(detail);
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss">

</style>
