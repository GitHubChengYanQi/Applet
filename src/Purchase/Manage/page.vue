<template>
  <view class="card">
    <Card
        title="请选择供应商"
    >
      <template v-slot:extra>
        <view class="extra" @click="onClick">
          {{ value || '全部供应商' }}
        </view>
      </template>

      <view style="padding: 10px 0;border-bottom: 1px solid #EEEEEE">
        <van-checkbox
            :value="checkItem"
            v-if="sys"
            shape="square"
            @change="checkAll()"
        >
          {{ checkItem ? '取消全选' : '全选' }}
        </van-checkbox>
      </view>

      <view
          v-for="item in pageList"
          :key="item.purchaseListId"
          class="skuList"
      >
        <view class="skuItem" @click="()=>sys && check(item)">
          <view v-if="sys">
            <van-checkbox
                :value="isCheck.includes(item.purchaseListId)"
                shape="square"/>
          </view>

          <view class="sku" @click="skuDetail(item.skuResult.skuId)">
            <SkuItem
                no-view
                extra-width="60px"
                :sku-result="item.skuResult"
            >
              <template v-slot:otherData>
                <view class="brand" v-if="item.brandResult.brandName !== undefined">
                  <elliptsis width="100%">
                    已绑定品牌：{{ item.brandResult.brandName }}
                  </elliptsis>
                </view>
                <view v-else style="margin-top: 4px">
                  <elliptsis width="100%">
                    {{ item.brandResult.brandName || '此物料暂未绑定品牌' }}
                  </elliptsis>
                </view>
                <elliptsis width="100%">
                  {{ item.createTime }}
                </elliptsis>
              </template>
            </SkuItem>
          </view>
          <view style="color: red">
            <elliptsis width="100%">
              ×{{ item.number }}
            </elliptsis>
          </view>
        </view>
      </view>

      <Empty v-if="emptyShow" description="暂无数据"></Empty>


    </Card>
    <view>
      <BottomButton
          only=""
          text="创建采购单"
          :disabled="disabled"
          @click="createOrder"
      ></BottomButton>
    </view>

    <view>
      <u-picker
          keyName="name"
          :show="show"
          :columns="columns"
          @cancel="cancel"
          @confirm="confirm()">
      </u-picker>
    </view>
  </view>
</template>

<script>

import Card from "@/components/Card/index.vue";
import {request} from "MES-Apis/lib/Service/request";
import Popup from "@/components/Popup/index.vue";
import SkuItem from "@/components/SkuItem/index.vue";
import List from "@/components/List/index.vue";
import Empty from "@/components/Empty/index.vue";
import Elliptsis from "@/components/Ellipsis/index.vue";
import BottomButton from "@/components/BottomButton/index.vue";


export default {
  name: "page",
  components: {SkuItem, BottomButton, Elliptsis, Empty, List, Popup, Card},
  data() {
    return {
      sys: false,
      pageList: [],
      customerId: '',
      value: '',
      show: false,
      hidden: true,
      columns: [],
      emptyShow: false,
      checkValue: false,
      isCheck: [],
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    async get() {
      const purchaseList = await this.listByPurchase()
      const data = purchaseList.data

      const customerName = data.map(item => {
        return {name: item.customerResult.customerName, id: item.customerId}
      })
      customerName.unshift('全部供应商')

      const noPageList = await this.noPageList()
      const {data: pageData} = noPageList
      this.pageList = pageData

      this.columns = [
        customerName
      ]

    }
    ,
    async listByPurchase() {
      return request({
        url: "/supply/listByPurchase",
        method: 'post',
        data: {}
      })

    }
    ,
    async noPageList() {
      return request({
        url: "/purchaseList/noPageList",
        method: 'post',
        data: {}
      })
    }
    ,
    async noPageListByCustomerId(customerId) {
      return request({
        url: "/purchaseList/noPageList",
        method: 'post',
        data: {
          customerId
        }
      })
    },
    onClick() {
      this.show = true
    },
    cancel() {
      this.show = false
    },
    async confirm(e) {
      const value = e.value.map(item => {
        return {name: item.name, id: item.id}
      })

      if (value[0].name === undefined) {
        this.value = '全部供应商'
      }

      if (value[0].id === undefined) {
        const pageList = await this.noPageList()
        this.pageList = pageList.data
        this.sys = this.pageList.length < 0
        this.isCheck = []
      }

      if (value[0].name !== undefined) {
        this.value = value[0].name
      }

      if (value[0].id !== undefined) {
        this.customerId = value[0].id
        const pageList = await this.noPageListByCustomerId(this.customerId)
        this.pageList = pageList.data
        this.emptyShow = this.pageList.length === 0;
        this.sys = this.pageList.length !== 0;
        this.isCheck = []
      }

      this.show = false
    },
    check(pageItem) {
      const exit = this.isCheck.find(item => item === pageItem.purchaseListId)
      if (exit) {
        this.isCheck = this.isCheck.filter(item => item !== pageItem.purchaseListId)
      } else {
        this.isCheck = [...this.isCheck, pageItem.purchaseListId]
      }
    },
    checkAll() {
      const exit = this.isCheck.length === this.pageList.length
      if (exit) {
        this.isCheck = []
      } else {
        this.isCheck = this.pageList.map(item => item.purchaseListId)
      }
    },
    skuDetail(skuId) {
      uni.navigateTo({
        url: `/Sku/SkuDetail/index?skuId=${skuId}`
      })
    },
    createOrder() {

    }
  },
  computed: {
    checkItem() {
      if (this.pageList || []) {
        return this.isCheck.length === this.pageList.length
      }
      return false
    },
    disabled() {
      if (this.isCheck || []) {
        return !this.isCheck.includes(this.isCheck[0])
      }
      return true
    }
  }

}
</script>

<style lang="scss">

.card {
  background-color: #FFFFFF;
  height: 100vh;
}

.extra {
  color: #2680eb;
  font-size: 12px;
}

.skuClass {
  position: sticky;
  background-color: #E1EBF6;
  top: 0;
  font-size: 16px;
  height: 45px;
  line-height: 32px;
}

.lable {
  width: 64px;
  text-align: justify;
  text-align-last: justify;
  display: inline-block;
  color: #9d9d9d;
}

.skuList {
  flex-direction: column;
}

.skuItem {
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #EEEEEE;

  .sku {
    flex-grow: 1;
  }
}

.brand {
  margin-top: 4px;
}

</style>