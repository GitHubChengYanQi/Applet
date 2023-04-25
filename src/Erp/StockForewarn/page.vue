<template>
  <view class="stockForewarn">
    <view class="search">
      <Search placeholder="请输入物料相关信息" :value="searchValue" :readonly="true" @click="searchClick" />
    </view>
    <view class="filter">
      <view class="classify" @click="click">
        <view class="title">{{ title || '物料分类' }}</view>
        <view class="icon">
          <uni-icons type="bottom" size="12"></uni-icons>
        </view>
      </view>
      <u-picker
          immediateChange
          :show="show"
          :columns="skuClass"
          @close="close"
          @cancel="close"
          @confirm="confirm"
          closeOnClickOverlay
      />
      <view class="classify" @click="warning">
        <view class="title">{{ title2 || '预警状态' }}</view>
        <view class="icon">
          <uni-icons type="bottom" size="12"></uni-icons>
        </view>
      </view>
    </view>
    <u-picker
        :show="show2"
        :columns="columns"
        immediateChange
        @close="close"
        @cancel="close"
        @confirm="confirm2"
        closeOnClickOverlay
    />

    <List
        ref="list"
        @request="StockForewarn.warningSku"
        @listSource="(newList)=>list = newList"
        :list="list"
        max-height="calc(100vh - 100px)"
        :default-params="{forewarnStatus:defaultForewarnStatus}"
    >
      <view
          v-for="(item,index) in list"
          :key="index"
          class="list"
      >
        <SkuItem :sku-result="item.skuResult">
          <view slot="otherData" class="number">
            <view>在途数量：{{ item.floatingCargoNumber || 0 }}</view>
            <view class="waite">待采数量：{{ item.purchaseNumber || 0 }}</view>
          </view>
          <view slot="otherData" class="storage">
            <view
                v-if="item.inventoryFloor >= 0"
                :class="{grey:item.number >= item.inventoryFloor}"
            >
              低库存：{{ item.inventoryFloor }}
            </view>
            <view
                v-if="item.inventoryCeiling >= 0"
                :class="{grey:item.number <= item.inventoryCeiling}"
            >
              高库存：{{ item.inventoryCeiling }}
            </view>
          </view>
        </SkuItem>
      </view>
    </List>
  </view>
</template>

<script>
import Search from '../../components/Search'
import Popup from "../../components/Popup";
import {getLocalParmas, isArray} from "../../util/Tools";
import {Sku} from "MES-Apis/lib/Sku/promise";
import List from "../../components/List/index";
import {StockForewarn} from "MES-Apis/lib/StockForewarn/promise";
import SkuItem from "../../components/SkuItem";

export default {
  props: [],
  components: {
    SkuItem,
    List,
    Popup,
    Search
  },
  data() {
    return {
      eventName: 'stockForewarn',
      searchData: {},
      searchValue: '',
      title: '',
      title2: '',
      show: false,
      show2: false,
      StockForewarn,
      list: [],
      defaultForewarnStatus: '',
      columns: [
        [{
          text: '全部',
          key: 'all'
        },
          {
            text: '低库存',
            key: 'min'
          },
          {
            text: '高库存',
            key: 'max'
          }]
      ],
      skuClass: []
    }
  },
  created() {
    const forewarnStatus = getLocalParmas().search.forewarnStatus
    let title = ''
    this.columns.map(array => {
      array.forEach(item => {
        if (item.key === forewarnStatus) {
          title = item.text
        }
      })
    })
    this.title2 = title
    this.defaultForewarnStatus = forewarnStatus
  },
  mounted() {
    const _this = this;
    uni.$on(this.eventName, data => {
      _this.refreshList({keyWords: data.searchValue})
      _this.searchValue = data.searchValue
    })
    this.getCateGory();
  },
  methods: {
    refreshList(data) {
      const newData = {...this.searchData, ...data}
      this.searchData = newData
      this.$refs.list.submit(newData)
    },
    searchClick() {
      uni.navigateTo({
        url: '/pages/searchPage/index?eventName=' + this.eventName + '&searchValue=' + this.searchValue
      });
    },
    click() {
      this.show = true;
    },
    close() {
      this.show = false;
      this.show2 = false;
    },
    confirm({value}) {
      this.show = false;
      this.title = value[0].key === 'all' ? '' : value[0].text
      this.refreshList({classId: value[0].key === 'all' ? null : value[0].key})
    },
    confirm2({value}) {
      this.show2 = false;
      this.title2 = value[0].key === 'all' ? '' : value[0].text
      this.refreshList({forewarnStatus: value[0].key === 'all' ? null : value[0].key})
    },
    warning() {
      this.show2 = true;
    },
    async getCateGory() {
      this.loading = true
      Sku.spuClassListSelect({data: {}}).then((res) => {
        this.skuClass = [[{text: '全部', key: 'all'}, ...isArray(res.data).map(item => ({
          text: item.label,
          key: item.value,
        }))]]
      }).finally(() => {
        this.loading = false
      })

    }
  }
}
</script>

<style lang="scss">

.stockForewarn {
  background-color: #FFFFFF;
  height: 100vh;
}

.search {
  padding: 0 12px;
}

.filter {
  border: solid 1px #F5F5F5;
  display: flex;
  font-size: 12px;
  color: #8d8d8d;
  text-align: center;
  align-items: center;

  .classify {
    flex-grow: 1;
    display: flex;
    padding: 8px;
    align-items: center;
    justify-content: center;

    .icon {
      padding-left: 4px;
    }
  }
}

.uniPicker {
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    padding-left: 4px;
  }
}

.header {
  height: 45px;
  display: flex;
  border-bottom: 1px solid #EEEEEE;
  justify-content: space-between;
  line-height: 45px;
  padding: 0 12px;

  .choose {
    font-size: 18px;
    text-align: center;
    color: #333333;
    margin: auto 0;
  }
}

.list {
  background-color: #FFFFFF;
  padding: 12px;

  .number {
    font-size: 12px;
    color: #00A200;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .storage {
    font-size: 12px;
    color: #ff3141;
    display: flex;
    align-items: center;
    gap: 8px;

    .grey {
      color: #9A9A9A;
    }
  }
}
</style>
