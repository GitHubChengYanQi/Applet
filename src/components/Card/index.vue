<template>
  <view>
    <view
        :style="style"
        @click="$emit('click')"
        v-if="!hidden"
        :class="[className, 'card']"
    >
      <view :style='headerStyle' v-if="!noHeader" :class="[headerClassName, 'header']">
        <view class='title'>
          <view v-if="!noLeftBorder" class='leftBorder' />
          {{ title || '' }}
          <slot name="title"></slot>
        </view>
        <view :class='extraClassName'>
          {{ extra || '' }}
          <slot name="extra"></slot>
        </view>
      </view>
      <view v-if="$slots.default && !noBody" :style="bodyStyle" :class="[bodyClassName, 'content']">
        <slot name="default"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Card',
  props: [
    'noBody',
    'noLeftBorder',
    'title',
    'extra',
    'bodyClassName',
    'headerClassName',
    'headerStyle',
    'bodyStyle',
    'className',
    'noHeader',
    'hidden',
    'titleClassName',
    'extraClassName',
    'style',
  ],
  mounted() {
  }
}
</script>

<style lang="scss">
.card {
  background-color: #fff;
  padding: 12px;
  margin-bottom: 3px;
  font-size: 14px;

  .header {
    display: flex;
    align-items: center;
    //border-bottom: 1px solid #F5F5F5;

    .title {
      flex-grow: 1;
    }
  }

  .content {
    padding: 8px;
  }
}


.title {
  color: #666666;
  display: flex;
  align-items: center;

  .leftBorder {
    width: 3px;
    height: 14px;
    background: $primary-color;
    margin: 0 5px 0 0;
    font-size: 14px;
    border-radius: 50px;
  }
}
</style>
