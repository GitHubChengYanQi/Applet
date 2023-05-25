<template>
  <uni-swipe-action-item :disabled="disabled" @change="$emit('change')">
    <slot></slot>
    <template v-slot:right>
      <view class="swipeActions">
        <view class="swipeDeleteButton" @click="click('delete')">
          <u-icon name="trash-fill" color="#fff" size="20" />
        </view>
        <view v-if="!noEdit" class="swipeEditButton" @click="click('edit')">
          <u-icon name="edit-pen-fill" color="#fff" size="20" />
        </view>
      </view>
    </template>
  </uni-swipe-action-item>
</template>

<script>
export default {
  options: {
    styleIsolation: 'shared'
  },
  name: 'Swipe',
  props: ['disabled', 'noEdit'],
  methods: {
    click(key) {
      this.$emit('click', key)
    }
  }
}
</script>

<style lang="scss">

.button-group--right {
  align-items: center;
}

.swipeActions {
  display: flex;
  align-items: center;
  height: 100%;

  .swipeDeleteButton, .swipeEditButton {
    background-color: #f56c6c;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .swipeEditButton {
    background-color: #5ac725;
  }
}

</style>
