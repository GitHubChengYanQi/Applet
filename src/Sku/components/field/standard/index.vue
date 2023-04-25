<template>
  <view>
    <view class="standard">
      <view class="type">
        <view class="select" @click="show = true">
          <view class="value"> {{ checked.text }}</view>
          <u-icon name="arrow-down" size="15"></u-icon>
        </view>
      </view>
      <view v-if="!auto" class="input">
        <uni-easyinput @input="onInput" :placeholder="'请选择'+placeholder"></uni-easyinput>
      </view>
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
export default {
  data() {
    return {
      auto: true,
      show: false,
      checked: {text: '自动生成', key: 1},
      columns: [[
        {text: '自定义', key: 0},
        {text: '自动生成', key: 1}
      ]]
    }
  },
  behaviors: ['uni://form-field'],
  props: {
    placeholder: String,
  },
  methods: {
    confirm({value}) {
      this.show = false
      this.checked = value[0]
      this.auto = value[0].key === 1
    },
    onInput(value) {
      this.$emit('input', value)
    },

  }
}
</script>

<style lang="scss">
.standard {
  display: flex;
  gap: 8px;
  align-items: center;

  .type {
    min-width: 70px;
    flex-grow: 1;
    width: 100%;
  }

  .input {
    min-width: 170px;
  }
}


.select {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
  line-height: 34px;
  border-radius: 4px;

  .value {
    flex-grow: 1;
  }

  .icon {

  }
}
</style>
