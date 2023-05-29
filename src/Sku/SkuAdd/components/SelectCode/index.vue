<template>
  <u-picker
      :defaultIndex="show ? [defaultIndex] : []"
      immediateChange
      :show="show"
      :columns="columns"
      @close="$emit('close')"
      @cancel="$emit('close')"
      @confirm="confirm"
      closeOnClickOverlay
  />
</template>

<script>

export default {
  name: 'SelectCode',
  data() {
    return {
      columns: [[{
        text: '一批一码',
        key: 1
      }, {
        text: '一物一码',
        key: 0
      }]],
      defaultIndex: 0
    }
  },
  props: ['value', 'show'],
  watch: {
    show() {
      const findIndex = this.columns[0].findIndex((item) => item.key === this.value)
      this.defaultIndex = findIndex > -1 ? findIndex : 0
    },
  },
  methods: {
    confirm({value}) {
      this.$emit('select', value[0])
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss">

</style>
