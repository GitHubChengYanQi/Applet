<template>
  <view>
    <Card title="来源" v-if="origin">
      <template v-slot:extra>
        <view class="state">
          {{ origin.title || '' }} / {{ origin.coding || '' }}
        </view>
      </template>
    </Card>
    <Card body-style="padding:0px">
      <template slot="title">
        <view class='header'>
          入库明细
          <LinkButton style="margin-left: 12px" @click="">申请明细</LinkButton>
        </view>
      </template>
      <template slot="extra">
        <view class='extra'>
          合计：<span>{{ data.length }}</span>类<span>{{ countNumber }}</span>件
        </view>
      </template>
      <view>
        <Search
            placeholder='请输入物料名称查询'
            @onClear="filterData = []"
            @onChange="searchChange"
            :value="seacrchValue"
            :noSearchButton="true"
        />
        <Empty description="已全部操作完毕" v-if="inStockDetails().length === 0" />
        <view
            v-for="(item, index) in inStockDetails()"
            :key="index"
        >
          <Slide
              :swipeId="'inStockItem'+index"
              :disabled="!action || item.status !== 0 || item.instockHandleId"
              @onRight="inWaitInShop"
              @onLeft="addError"
          >
            <InStockItem
                :ask="true"
                :detail='item.handle'
                :index='index'
                :item='item'
                :dataLength="(inStockDetails().length > 3 && !allSku) ? 2 : inStockDetails().length - 1"
                :key='index'
            />
          </Slide>
        </view>
      </view>
    </Card>
    <Card title="供应商" :extra="data.customerResult && data.customerResult.customerName || '无'" />
    <Card title="主题" :extra="taskDetail.theme || '无'" />
    <Card title="入库类型" :extra="getInType(data.instockType)" />
    <Card title="注意事项">
      {{
        isArray(data.announcementsList).length === 0 ? '无' : isArray(data.announcementsList).map(item => item.content).join('、')
      }}
    </Card>
    <Card title="备注">{{ data.remark }}</Card>
    <Card title="附件">
      <view class="remarks">
        无
      </view>
    </Card>

    <ActionButtons
        v-if="actionNode"
        :taskDetail='taskDetail'
        :statusName='data.statusName'
        @afertShow="$emit('afertShow')"
        :taskId='taskId'
        :logIds='logIds'
        :createUser='taskDetail.createUser'
        :permissions="true"
        :actions="nodeActions"
        @onClick="onAction"
    />
  </view>
</template>

<script>
import {getInType} from "../inStock";
import {isArray, queryString} from "../../../../util/Tools";
import Card from "../../../../components/Card";
import LinkButton from "../../../../components/LinkButton";
import Search from "../../../../components/Search";
import {SkuResultSkuJsons} from "../../Sku/sku";
import Empty from "../../../../components/Empty";
import Slide from "../../../../components/Slide";
import InStockItem from "../components/InStockItem";

export default {
  name: 'InStockDetail',
  components: {InStockItem, Slide, Empty, Search, LinkButton, Card},
  props: [
    'actionNode',
    'taskDetail',
    'loading',
    'data',
    'permissions',
    'type',
    'logIds',
    'taskId',
    'actions',
    'action',
    'pickListsId',
    'handleResults',
  ],
  data() {
    return {
      getInType,
      isArray,
      filterData: [],
      seacrchValue: "",
      allSku: false,
      details: [],
      countNumber: 0
    }
  },
  mounted() {
    this.inStockData()
  },
  methods: {
    inStockData() {

      const actions = [];
      const noAction = [];
      const wait = [];
      const error = [];

      let countNumber = 0;

      this.data.forEach((item) => {
        countNumber += item.number;
        if (item.realNumber === 0 && item.status !== 0) {
          return;
        }
        if (item.status === 0) {
          actions.push(item);
        } else if (item.status === -1 || item.status === 50) {
          error.push(item);
        } else if (item.status === 1) {
          wait.push(item);
        } else {
          noAction.push(item);
        }
      });

      this.handleResults.forEach((item) => {
        switch (item.type) {
          case 'inStock':
            noAction.push({...item, handle: true});
            break;
          case 'ErrorCanInstock':
          case 'ErrorStopInstock':
          case 'ErrorNumber':
            error.push({...item, handle: true});
            break;
          default:
            break;
        }
      });
      this.countNumber = countNumber
      this.details = [...actions, ...error, ...wait, ...noAction];
    },
    searchChange(value) {
      this.filterData = this.details.filter(item => {
        const sku = SkuResultSkuJsons({skuResult: item.skuResult}) || '';
        return queryString(value, sku);
      })
      this.seacrchValue = value
    },
    inStockDetails() {
      return this.seacrchValue ? this.filterData : this.details;
    },
    inWaitInShop() {
      console.log('inWaitInShop')
    },
    addError() {
      console.log('addError')
    }
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
}

.extra {
  color: #000000;
  display: flex;
  gap: 4px;
  align-items: center;
}

.search {
  padding: 0;
}

</style>
