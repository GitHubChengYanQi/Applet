<template>
  <view v-if="Array.isArray(progress) && progress.length > 0">
    <view class='dataNumber'>
      <view class="allProgress">
        <view
            v-for="(item,index) in progress"
            :key='index'
            class='progress'
            :style="{ backgroundColor: item.color, width: `${item.num}%` }"
        />
        <view
            class="number"
            :style="{
          left:(progress[0].num === 0 || progress[0].num === 100) ? 0 : `calc(${progress[0].num}% - 25px)`,
          right:(progress[0].num === 0 || progress[0].num === 100) && 0,
          color:progress[0].num > 0 ? '#fff' : '#007aff',
          margin: (progress[0].num === 0 || progress[0].num === 100) && 'auto',
          width:'fit-content'
        }"
        >
          {{ progress[0].num }}%
        </view>
      </view>
    </view>

  </view>
</template>

<script>

export default {
  name: 'process',
  props: [
    'progress'
  ],
  data() {
    return {}
  },
  methods: {},
  mounted() {

  }
}
</script>

<style lang="scss">

.allProgress {
  border-radius: 100px;
  display: flex;
  overflow: hidden;
  position: relative;

  .number {
    top: -2px;
    position: absolute;
    font-size: 12px;
  }

  .progress {
    display: inline-block;
    padding: 6px 0;
    background-color: #D8D8D8;
  }
}

.dataNumber {
}

</style>
