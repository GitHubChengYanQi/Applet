<template>
  <view>
    <view v-if="detailData.type === ReceiptsEnums.instockOrder"></view>
    <view v-if="detailData.type === ReceiptsEnums.outstockOrder">
      <OutStockDetail
          :actionNode='receiptData().actionNode'
          :logIds='receiptData().logIds'
          :taskId='detailData.processTaskId'
          @afertShow='() => bottomButton = true'
          :permissions='permissions'
          :data='detailData.receipts'
          :actions='receiptData().actions'
          :getAction='getAction'
          @refresh='refreshOrder'
          :loading='loading'
          :type='detailData.type'
          :pickListsId="detailData.receipts.pickListsId"
          :taskDetail='detailData'
          :action="getAction('outStock').id && permissions"
      />
    </view>
    <view v-if="detailData.type === ReceiptsEnums.error"></view>
    <view v-if="detailData.type === ReceiptsEnums.stocktaking"></view>
    <view v-if="detailData.type === ReceiptsEnums.maintenance"></view>
    <view v-if="detailData.type === ReceiptsEnums.allocation"></view>

    <view class="process">
      <uni-section title="审批流程" type="line">
        <view class="processLoading" v-if="loading">
          <van-loading type="spinner" color="#1989fa" />
        </view>
        <Process
            v-else
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

    <div v-if="bottomButton" style="height: 90px" />

    <Footer
        v-if="!loading"
        :version='detailData.version'
        :currentNode='currentNode'
        :detail='detailData'
        @refresh="$emit('refresh')"
    />
  </view>
</template>

<script>

import OutStockDetail from "../../../../Erp/OutStock/OutStockDetail";
import Footer from "./components/Footer/index";
import {ReceiptsEnums} from "../../../ReceiptsEnums";
import Process from './components/Process/index'

export default {
  components: {OutStockDetail, Footer, Process},
  props: ['success', 'detailData', 'currentNode', 'loading', 'permissions'],
  data() {
    return {
      ReceiptsEnums,
      bottomButton: false
    }
  },
  methods: {
    receiptData() {
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
      return {
        actions,
        logIds,
        actionNode
      }
    },
    getAction(action) {
      if (this.detailData.status !== 0) {
        return {};
      }
      const actionData = this.receiptData().actions.filter(item => {
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

.processLoading {
  padding: 24px;
  text-align: center;
}

.comment {
  background-color: #fff;
  padding: 20px 0;
  margin-top: 3px;
  text-align: center;
  font-size: 14px;
}
</style>
