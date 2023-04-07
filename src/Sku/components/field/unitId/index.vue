<template>
  <view>
    <view class="select" @click="show = true">
      <view class="value" v-if="checked.key"> {{ checked.text }}</view>
      <view class="placeholder" v-else> 请选择单位</view>
      <u-icon name="arrow-down" size="15"></u-icon>
    </view>
    <u-picker
        immediateChange
        :show="show"
        :columns="columns"
        @close="show = false"
        @cancel="show = false"
        @confirm="confirm"
        closeOnClickOverlay
    />
  </view>
</template>

<script>
///unit/listSelect
import {
  request
} from 'MES-Apis/lib/Service/request';
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  data() {
    return {
      show: false,
      columns: [],
      checked: {},
    }
  },
  props: {
    value: String,
    placeholder: String,
  },
  watch: {
    value(value) {
      if (value && this.columns[0]){
        this.checked = this.columns[0].find(item => {
          return item.key === value
        })
      }
    }
  },
  mounted() {
    this.get();
  },
  methods: {
    confirm({value}) {
      this.$emit('input',value[0].key)
      this.show = false
      this.checked = value[0]
    },
    async get() {
      const response = await Sku.unitListSelect();
      const {data} = response;
      const columns = data.map(item => {
        return {
          key: item.value, text: item.label || '未命名'
        }
      })
      this.columns = [columns];
      if (this.value){
        this.checked = columns.find(item => {
          return item.key === this.value
        })
      }
    },

  }
}
</script>

<style lang="scss">
.select {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
  line-height: 34px;
  border-radius: 4px;

  .placeholder {
    flex-grow: 1;
    color: #ccc;
  }

  .value {
    flex-grow: 1;
  }

  .icon {

  }
}
</style>
