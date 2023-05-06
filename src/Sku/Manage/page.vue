<template>
  <view class="manage">
    <view class="item" @click="skuClass">
      <view class="info">
        分类管理
        <view class="des">
          管理物料的分类
        </view>
      </view>
      <view>
        <u-icon name="arrow-right" size="18" color="#929293" />
      </view>
    </view>

    <view class="item" @click="addSku">
      <view class="info">
        新增物料
        <view class="des">
          向库存新增物料
        </view>
      </view>
      <view>
        <u-icon name="arrow-right" size="18" color="#929293" />
      </view>
    </view>

    <view class="item" @click="unit">
      <view class="info">
        单位管理
        <view class="des">
          管理物料的单位
        </view>
      </view>
      <view>
        <u-icon name="arrow-right" size="18" color="#929293" />
      </view>
    </view>

    <view class="item">
      <view class="info">
        品牌管理
        <view class="des">
          管理物料的品牌
        </view>
      </view>
      <view>
        <u-icon name="arrow-right" size="18" color="#929293" />
      </view>
    </view>
  </view>
</template>

<script>


import Icon from "../../components/Icon";

export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'SelectUser',
  components: {Icon},
  data() {
    return {}
  },
  mounted() {

  },
  watch: {},
  computed: {},
  methods: {
    addSku() {
      uni.navigateTo({
        url: '/Sku/SkuAdd/index'
      })
    },
    skuClass() {
      uni.navigateTo({
        url: '/Sku/SkuClass/SkuClassList/index'
      })
    },
    unit() {
      uni.navigateTo({
        url: '/Sku/Unit/UnitList/index'
      })
    }
  }
}
</script>

<style lang="scss">
.manage {
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.item {
  margin: 0 12px;
  padding: 12px 0;
  border-bottom: solid 1px #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;

  .info {
    flex-grow: 1;

    .des {
      padding-top: 4px;
      color: #808080;
      font-size: 12px;
    }
  }


}
</style>
