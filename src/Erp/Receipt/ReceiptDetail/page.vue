<template>
  <scroll-view style="height:100vh" :scroll-y="scroll">
    <view v-if="!detailData && !loading">
      <Empty type="error" description="获取审批详情失败!" />
    </view>
    <view v-else-if="!detailData && loading">
      <Loading :skeleton="true" skeleton-type="page" />
    </view>
    <view v-else>
      <Loading :loading="loading" />
      <Header
          :avatar="user.avatar"
          :coding="receipts.coding"
          :create-name="user.name"
          :create-time="detailData.createTime"
          :status-name="receipts.statusName"
          :title="detailData.taskName"
      />
      <view class="tabs">
        <view v-for="tab in tabs" :key="tab.key" class="tabItem">
          <view
              v-if="tab.key === 'log' ? receiptsType().logTitle : true"
              :class="{tabCheck:true,tabChecked:tabKey===tab.key}"
              @click="tabKeyChange(tab.key)"
          >
            {{ tab.key === 'log' ? receiptsType().logTitle : tab.title }}
          </view>
        </view>
      </view>

      <view>
        <view v-if="tabKey === 'data'">
          <ReceiptContent
              :success='success'
              :permissions='detailData.permissions'
              :detailData='detailData'
              :currentNode='currentNode'
              @refresh="refresh"
              :loading='loading'
              @addComments='hiddenFooter=true'
          />
        </view>
        <view v-if="tabKey === 'log'">
          <Log :type='type' :detail='detailData' />
        </view>
        <view v-if="tabKey === 'dynamic'">
          <Dynamic :taskId="detailData.processTaskId" />
        </view>
        <view v-if="tabKey === 'relation'">
          <Relation />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>

import Header from './components/Header'
import ReceiptContent from './components/ReceiptContent'
import {getLocalParmas} from "../../../util/Tools";
import {ReceiptsEnums} from "../ReceiptsEnums";
import {Process} from "MES-Apis/lib/Process/promise";
import Loading from '../../../components/Loading'
import Empty from "../../../components/Empty";
import Log from "./components/Log";
import Relation from "./components/Relation";
import Dynamic from "./components/Dynamic";

export default {
  name: 'receiptDetail',
  components: {Dynamic, Relation, Log, Empty, Header, ReceiptContent, Loading},
  data() {
    return {
      auth: true,
      tabs: [
        {key: 'data', title: '基本信息'},
        {key: 'log', title: ''},
        {key: 'dynamic', title: '动态日志'},
        {key: 'relation', title: '关联单据'},
      ],
      tabKey: 'data',
      type: '',
      hiddenFooter: false,
      receipts: {},
      user: {},
      success: false,
      loading: true,
      detailData: null,
      currentNode: [],
      search: {},
    }
  },
  mounted() {
    this.search = getLocalParmas().search
    this.getTaskDetail()
  },
  computed: {
    scroll() {
      return !this.$store.state.dialog.show
    }
  },
  methods: {
    logined() {

    },
    notLogin() {

    },
    getTaskDetail() {
      const taskId = this.search.id
      const formId = this.search.formId
      const type = this.search.type
      this.loading = true
      if (!taskId && !(formId && type)) {
        this.loading = false
        return
      }
      Process.auditDetail({taskId, formId, type}).then((res) => {
        this.type = res.data?.type
        this.receipts = res.data?.receipts || {}
        this.user = res.data?.user || {}
        const node = this.getCurrentNode(res.data.stepsResult, res.data.version)
        this.currentNode = Array.isArray(node) ? node : [node]
        this.detailData = res.data
        this.success = true
      }).catch(() => {
        this.success = false
      }).finally(() => {
        this.loading = false
      })
    },
    getCurrentNode(data, version) {
      if (!data) {
        return {};
      }
      const logResults = data.logResults || [];
      const currentNode = version ? logResults.filter(item => item.status === 3).length === logResults.length : data.logResult && data.logResult.status === -1;
      if (currentNode) {
        if (data.stepType === 'route') {
          return data.conditionNodeList.map((item) => {
            return getCurrentNode(item.childNode, version);
          });
        }
        return data;
      }
      return this.getCurrentNode(data.childNode, version);
    },
    tabKeyChange(key) {
      this.tabKey = key
    },
    receiptsType() {
      switch (this.type) {
        case ReceiptsEnums.instockOrder:
          return {
            logTitle: '入库记录',
          };
        case ReceiptsEnums.outstockOrder:
          return {
            logTitle: '出库记录',
          };
        case ReceiptsEnums.stocktaking:
          return {
            logTitle: '盘点记录',
          };
        case ReceiptsEnums.maintenance:
          return {
            logTitle: '养护记录',
          };
        case ReceiptsEnums.allocation:
          return {};
        case ReceiptsEnums.error:
          return {};
        default:
          return {};
      }
    },
    refresh() {
      this.success = false
      this.getTaskDetail()
    }
  }
}

</script>

<style lang="scss">

.tabs {
  background-color: $body-color;
  padding-top: 8px;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;

  .tabItem {
    flex-grow: 1;
  }

  .tabChecked {
    padding-bottom: 8px;
    color: #2680eb;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    border-bottom: 2px solid #2680eb;
  }

  .tabCheck {
    padding-bottom: 8px;
    margin: auto;
    text-align: center;
    font-size: 14px;
  }
}
</style>
