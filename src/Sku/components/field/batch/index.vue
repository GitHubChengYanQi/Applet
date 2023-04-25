<template>
  <uni-data-checkbox :value="value" :localdata="qcode" @change="change"></uni-data-checkbox>
</template>

<script>
export default {
  behaviors: ['uni://form-field'],
  props:['value'],
  data() {
    return {
      qcode: [{
        text: '一批一码',
        value: 1
      }, {
        text: '一物一码',
        value: 0
      }]
    }
  },
  methods: {
    change({detail: {data: {value}}}) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
