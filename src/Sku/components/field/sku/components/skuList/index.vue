<template>
  <view class="line">
    <view class="content">
      <view class="item">
        名称:
        <uni-easyinput v-model="label" @input="onInput" placeholder="请输入名称"></uni-easyinput>
      </view>
      <view class="item">
        内容:
        <uni-easyinput v-model="content" @input="onInput" placeholder="请输入内容"></uni-easyinput>
      </view>
    </view>
    <view class="rubbish">
      <uni-icons type="trash-filled" color="red" size="20" @click="del"></uni-icons>
    </view>
  </view>

</template>

<script>
export default {
  behaviors: ['uni://form-field'],
  data() {
    return {
      label: '',
      content: ''
    }
  },
  props: {
    index: Number,
    value: Object,
  },
  watch: {
    value: function () {
      this.label = this.value.label;
      this.content = this.value.value;
    }
  },
  mounted() {

  },
  methods: {
    del() {
      this.$emit("delete", this.index);
    },
    onInput() {
      this.$emit('input', {
        index: this.index,
        label: this.label,
        value: this.content
      })
    }
  }
}
</script>

<style lang="scss">
.line {
  padding-top: 10px;
  display: flex;
  align-items: center;

  .content {
    flex-grow: 1;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 8px;
  }
}

.rubbish {
  width: 50px;
  text-align: center;
}
</style>
