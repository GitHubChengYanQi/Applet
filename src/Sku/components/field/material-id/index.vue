<template>
  <view>
    <view class="select" @click="open">
      <view class="value" v-if="checked.key"> {{ checked.text }}</view>
      <view class="placeholder" v-else>请选择材质</view>
      <u-icon name="arrow-down" size="15"></u-icon>
    </view>
    <u-picker
        v-if="pickerShow"
        :defaultIndex="[defaultIndex]"
        :loading="loading"
        immediateChange
        :show="show"
        :columns="columns"
        @close="close"
        cancelText="新增"
        cancelColor="#3c9cff"
        @cancel="cancel"
        @confirm="confirm"
        closeOnClickOverlay
    />
  </view>
</template>

<script>
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  data() {
    return {
      show: false,
      pickerShow: false,
      loading: false,
      columns: [],
      checked: {},
      defaultIndex: 0
    }
  },
  props: {
    value: String,
    placeholder: String,
  },
  watch: {
    value(value) {
      if (value && this.columns[0]) {
        this.defaultIndex =  this.columns[0].findIndex(item => {
          return item.key === value
        })
      }
    }
  },
  mounted() {
    const _this = this
    uni.$on('materialAddSuccess', (materialId) => {
      this.close()
      _this.get(materialId);
    })
    _this.get();
  },
  methods: {
    open() {
      this.pickerShow = true
      this.show = true
    },
    close() {
      this.show = false
      setTimeout(() => {
        this.pickerShow = false
      }, 500)
    },
    cancel() {
      uni.navigateTo({
        url: '/Sku/Material/MaterialAdd/index'
      })
    },
    confirm({value}) {
      this.$emit('input', value[0].key)
      this.show = false
      this.checked = value[0]
    },
    async get(materialId) {
      this.loading = true
      const response = await Sku.materialListSelect();
      const {data} = response;
      const columns = data.map(item => {
        return {
          key: item.value, text: item.label || '未命名'
        }
      })
      this.columns = [columns];
      if (materialId) {
        console.log(materialId,columns)
        const checked = columns.find(item => {
          return item.key === materialId
        })
        this.$emit('input', materialId)
        this.checked = checked
      }

      this.loading = false
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
