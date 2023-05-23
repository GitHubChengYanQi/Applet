<template>
  <u-picker
      :defaultIndex="show ? [defaultIndex] : []"
      :loading="loading"
      immediateChange
      :show="show"
      :columns="columns"
      @close="$emit('close')"
      cancelText="新增"
      cancelColor="#3c9cff"
      @cancel="cancel"
      @confirm="confirm"
      closeOnClickOverlay
  />
</template>

<script>
import {Sku} from "MES-Apis/lib/Sku/promise";

export default {
  name: 'SelectUnit',
  data() {
    return {
      loading: false,
      columns: [],
      defaultIndex: 0
    }
  },
  props: {
    value: String,
    show: Boolean,
  },
  watch: {
    show() {
      const findIndex = this.columns[0].findIndex((item) => item.key === this.value)
      this.defaultIndex = findIndex > -1 ? findIndex : 0
    },
  },
  mounted() {
    const _this = this
    uni.$on('unitAddSuccess', (unitId) => {
      _this.get(unitId);
    })
    _this.get();
  },
  methods: {
    cancel() {
      uni.navigateTo({
        url: '/Sku/Unit/UnitAdd/index'
      })
    },
    confirm({value}) {
      this.$emit('select', value[0])
      this.$emit('close')
    },
    async get(unitId) {
      this.loading = true
      const response = await Sku.unitListSelect();
      const {data} = response;
      const columns = data.map(item => {
        return {
          key: item.value, text: item.label || '未命名'
        }
      })
      this.columns = [columns];
      if (unitId) {
        const checked = columns.find(item => {
          return item.key === unitId
        })
        this.$emit('select', checked)
        this.$emit('close')
      }
      this.loading = false
    },

  }
}
</script>

<style lang="scss">

</style>
