<template>
  <view>
    <view class="storeItem">
      <Icon icon="icon-cangkutubiao" size="20" />
      {{ storeHouseData.name }}
    </view>
    <view class="storeChildren">
      <view
          v-for="(item,index) in childrenList"
          :key="index"
          class="storeItem"
      >
        <Icon icon="icon-cangkutubiao" size="20" />
        {{ item.name }}
        <MyButton
            v-if="item.storehouseId === 'newStorehouseId'"
            plain
            type="primary"
            @click="$emit('openClass')"
        >
          绑定物料分类
        </MyButton>
      </view>
    </view>

  </view>
</template>

<script>
import {isArray} from "../../../../util/Tools";
import Icon from "../../../../components/Icon";
import MyButton from "../../../../components/MyButton";

export default {
  name: 'StoreHouseStructure',
  components: {MyButton, Icon},
  props: {
    storeHouseData: {
      default: _ => {
      }
    },
    current: {
      default: _ => {
      }
    },
    cateGoryData: Array,
    classList: Array,
    storehouseId: String
  },
  computed: {
    childrenList() {
      const childrenList = isArray(this.storeHouseData ? this.storeHouseData.childrenList : []).filter(item => item.storehouseId !== this.storehouseId)
      if (this.current.name) {
        return [...childrenList, {name: this.current.name, storehouseId: 'newStorehouseId'}]
      }
      return childrenList
    }
  },
  data() {
    return {
      isArray,
      show: false
    }
  }
}
</script>

<style lang="scss">
.storeItem {
  padding: 12px 0;
  border-bottom: 1px solid #EDEDED;
  display: flex;
  align-items: center;
  gap: 8px;
}

.storeChildren {
  padding-left: 10px;
}
</style>
