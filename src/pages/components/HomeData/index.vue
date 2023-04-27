<template>
  <view class="assetData">
    <view class="total">
      总资产：<span class="num">￥10232.00</span>
    </view>
    <f2-uni
        :width="windowWidth - 48"
        :height="170"
        :onInit="onInitChart"
    />
  </view>
</template>

<script>
import F2Uni from "../../../components/f2-uni";

export default {
  name: 'HomeData',
  components: {F2Uni},
  data() {
    return {
      current: 0,
      windowWidth: 0
    }
  },
  created() {
    this.windowWidth = this.$store.state.systemInfo.systemInfo.windowWidth || 0
  },
  methods: {
    onInitChart: (F2Constructor, config) => {
      const chart = new F2Constructor.Chart(config)
      const map = {
        '账户余额': '34663',
        '库存总额': '458893',
        '固定资产': '23622',
        '应付欠款': '0',
      };
      const data = [{
        name: '账户余额',
        percent: 0.6,
        a: '1'
      }, {
        name: '库存总额',
        percent: 0.2,
        a: '1'
      }, {
        name: '固定资产',
        percent: 0.1,
        a: '1'
      }, {
        name: '应付欠款',
        percent: 0.1,
        a: '1'
      }];
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.legend({
        position: 'left',
        itemFormatter: (val) => {
          return val + '  ￥' + map[val];
        }
      });
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 1
      });
      chart.axis(false);
      chart.interval()
          .position('a*percent')
          .color('name', ['#F04864', '#1890FF', '#13C2C2', '#FACC14'])
          .adjust('stack')
          .style({
            lineWidth: 1,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round'
          })
          .animate({
            appear: {
              duration: 1200,
              easing: 'bounceOut'
            }
          });

      chart.render();
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

.assetData {
  position: relative;

  .total {
    position: absolute;
    top: 12px;
    left: 24px;
    font-size: 14px;

    .num {
      color: #19be6b;
    }
  }
}
</style>
