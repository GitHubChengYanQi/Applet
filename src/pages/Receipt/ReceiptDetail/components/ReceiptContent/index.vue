<template>
  <view>
    <view v-if="detailData.type === ReceiptsEnums.instockOrder"></view>
    <view v-if="detailData.type === ReceiptsEnums.outstockOrder">
      <OutStockDetail
          :actionNode='actionNode'
          :logIds='logIds'
          :taskId='detailData.processTaskId'
          @afertShow='() => bottomButton = true'
          :permissions='permissions'
          :data='detailData.receipts'
          :actions='actions'
          :getAction='getAction'
          :refresh='refreshOrder'
          :loading='loading'
          :type='detailData.type'
          :taskDetail='detailData'
      />
    </view>
    <view v-if="detailData.type === ReceiptsEnums.error"></view>
    <view v-if="detailData.type === ReceiptsEnums.stocktaking"></view>
    <view v-if="detailData.type === ReceiptsEnums.maintenance"></view>
    <view v-if="detailData.type === ReceiptsEnums.allocation"></view>

    <view class="process">
      <uni-section title="审批流程" type="line">
        <Process
            :auditData='detailData.stepsResult'
            :version='detailData.version'
            :createUser='detailData.user'
        />
      </uni-section>
    </view>

    <view class="comment">
      <view class="addComment">
        <uni-icons type="compose" size="20"></uni-icons>
        添加评论
      </view>
    </view>

    <Footer
        :version='detailData.version'
        :currentNode='currentNode'
        :detail='detailData'
        @refresh="$emit('refresh')"
    />
  </view>
</template>

<script>

import OutStockDetail from "../../../../Erp/OutStock/OutStockDetail";
import Footer from "../Footer";
import {ReceiptsEnums} from "../../../ReceiptsEnums";
import Process from '../Process/index'

export default {
  components: {OutStockDetail, Footer, Process},
  props: ['success', 'detailData', 'currentNode', 'loading', 'permissions'],
  data() {
    return {
      ReceiptsEnums,
      actions: [],
      logIds: [],
      actionNode: false,
      bottomButton: false
    }
  },
  mounted() {
    const actions = [];
    const logIds = [];
    let actionNode = false;

    if (this.detailData.status === 0) {
      this.currentNode.forEach((item) => {

        if (item.stepType === 'status' && !actionNode) {
          actionNode = true;
        }

        if (this.detailData.version) {
          const logResults = item.logResults || [];
          logResults.map(item => {
            logIds.push(item.logId);
          });
        } else {
          const logResult = item.logResult || {};
          logIds.push(logResult.logId);
        }

        if (item.auditRule && Array.isArray(item.auditRule.actionStatuses)) {
          item.auditRule.actionStatuses.map((item) => {
            actions.push({action: item.action, id: item.actionId, name: item.actionName});
          });
        }
        return null;
      });
    } else {
      actionNode = true;
    }

    this.actions = actions
    this.logIds = logIds
    this.actionNode = actionNode
  },
  methods: {
    getAction(action) {
      if (this.detailData.status !== 0) {
        return {};
      }
      const actionData = actions.filter(item => {
        return item.action === action;
      });
      return actionData[0] || {};
    },
    refreshOrder() {
      this.$emit('refresh')
      this.bottomButton = false
    },
  },
}
</script>

<style lang="scss">

.process {
  margin-top: 3px;
}

.comment {
  background-color: #fff;
  padding: 20px 0;
  margin-top: 3px;
  text-align: center;
  font-size: 14px;
}
</style>
