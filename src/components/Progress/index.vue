<template>
  <view style="width: 100%">
    <view class='dataNumber'>
      <view class="allProgress">
        <view
            v-for="(item,index) in progressFormat()"
            :key='index'
            class='progress'
            :style="{ backgroundColor: item.color, width: `${item.num}%` }"
        />
      </view>
    </view>

  </view>
</template>

<script>


export default {
  name: 'Progress',
  props: ['progress', 'total'],
  data() {
    return {}
  },
  methods: {
    progressFormat() {
      let number = 0
      const array = this.progress.map(item => item).sort((a, b) => a.number - b.number)
      return [...array.map((item, index) => {
        if (index === 0) {
          const num = Math.round(((item.number / this.total) * 100) || 0)
          number += num
          return {num, color: item.color}
        } else {
          const num = Math.round(((item.number - (array[index - 1]).number) / this.total) * 100) || 0
          number += num
          return {num, color: item.color}
        }
      }), {
        num: this.total <= 0 ? 0 : 100 - number,
        color: '#ccc'
      }]
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss">

.allProgress {
  border-radius: 100px;
  display: flex;
  overflow: hidden;

  .progress {
    display: inline-block;
    padding: 4px 0;
    background-color: #D8D8D8;
  }
}

.dataNumber {
  padding: 0 12px 8px;

  .number {
    padding-right: calc(2em + 8px);
    display: flex;
    font-size: 12px;

    div {
      text-align: center;
    }
  }
}

</style>
