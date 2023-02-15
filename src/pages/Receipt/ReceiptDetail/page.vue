<template>
  <div>
    <div v-if="loading">
      loading...
    </div>
    <div v-if="!detailData">
      获取审批详情失败!
    </div>
    <div v-else>
      <Header
          :avatar="false"
          coding="123"
          create-name="aaa"
          create-time=""
          status-name="123"
          title="123"
      />
      <view class="tab">
        <view v-for="tab in tabs" :key="tab.key">
          <view
              v-if="tab.key === 'log' && receiptsType().logTitle"
              :class="{tabCheck:true,tabChecked:tabKey===tab.key}"
              @onClick="tabKeyChange(tab.key)"
          >
            {{ tab.key === 'log' ? receiptsType().logTitle : tab.title }}
          </view>
        </view>
      </view>

      <view>
        <view></view>
      </view>
      <OutStockDetail />
    </div>
  </div>
</template>

<script>
import OutStockDetail from '../../../pages/Erp/OutStock/OutStockDetail/index'
import Header from './components/Header/index'
import {auditDetail} from "MES-Apis/src/Process/promise";
import {getLocalParmas} from "../../../util/Tools";
import {ReceiptsEnums} from "../ReceiptsEnums";

export default {
  name: 'receiptDetail',
  components: {OutStockDetail, Header},
  data() {
    return {
      tabs: [
        {key: 'data', title: '基本信息'},
        {key: 'log', title: ''},
        {key: 'dynamic', title: '动态日志'},
        {key: 'relation', title: '关联单据'},
      ],
      tabKey: 0,
      type: '',
      loading: false,
      detailData: null,
    }
  },
  mounted() {
    const taskId = '1620961424866029570' || getLocalParmas().search.id
    const formId = getLocalParmas().search.formId
    const type = getLocalParmas().search.type
    this.loading = true
    if (!taskId && !(formId && type)) {
      this.loading = false
      return
    }
    auditDetail({taskId, formId, type}).then((res) => {
      console.log(res)
      this.type = res.type
      this.detailData = res
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    tabKeyChange(key) {
      console.log(key)
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
    }
  }
}

</script>

<style lang="scss">
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
</style>
