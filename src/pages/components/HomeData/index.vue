<template>
  <view>
    <swiper
        class="swiper"
        circular
        :indicator-dots="true"
        :autoplay="false"
        :interval="5000"
        :duration="500"
        @change="change"
    >
      <swiper-item>
        <f2-uni
            :width="windowWidth - 48"
            :height="170"
            :onInit="onInitChart"
        />
        <view style="height: 10px" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import F2Uni from "../../../components/f2-uni";

export default {
  name: 'HomeData',
  components: {F2Uni},
  data() {
    return {
      current: 0
    }
  },
  computed: {
    windowWidth() {
      if (this.$store.state.systemInfo.systemInfo) {
        return this.$store.state.systemInfo.systemInfo.windowWidth || 0
      }
      return 0
    }
  },
  methods: {
    onInitChart: (F2Constructor, config) => {
      const chart = new F2Constructor.Chart(config)
      const data = [
        {value: 63.4, city: 'New York', date: '2011-10-01'},
        {value: 62.7, city: 'Alaska', date: '2011-10-01'},
        {value: 72.2, city: 'Austin', date: '2011-10-01'},
        {value: 58, city: 'New York', date: '2011-10-02'},
        {value: 59.9, city: 'Alaska', date: '2011-10-02'},
        {value: 67.7, city: 'Austin', date: '2011-10-02'},
        {value: 53.3, city: 'New York', date: '2011-10-03'},
        {value: 59.1, city: 'Alaska', date: '2011-10-03'},
        {value: 69.4, city: 'Austin', date: '2011-10-03'}
      ]
      chart.source(data, {
        date: {
          range: [0, 1],
          type: 'timeCat',
          mask: 'MM-DD'
        },
        value: {
          max: 300,
          tickCount: 4
        }
      })
      chart.area().position('date*value').color('city').adjust('stack')
      chart.line().position('date*value').color('city').adjust('stack')
      chart.render()
      // 注意：需要把chart return 出来
      return chart
    },
    change({detail: {current}}) {
      this.current = current
    }
  }
}
</script>

<style lang="scss">
.swiper {
  height: 180px;
}
</style>
