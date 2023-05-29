<template>
  <view>
    <Empty type="error" description=" " v-if="error" />
    <Loading skeleton v-else-if="loading" />
    <view v-else class="assetData">
      <view class="total">
        总资产：<span class="num">￥{{ total }}</span>
      </view>
      <f2-uni
          :padding="[20,0,20,(windowWidth / 2) - 48]"
          :width="windowWidth - 48"
          :height="170"
          :onInit="onInitChart"
          :data="data"
      />
    </view>
  </view>
</template>

<script>
import F2Uni from "../../../components/f2-uni";
import {Erp} from "MES-Apis/lib/Erp/promise";
import Loading from "../../../components/Loading/index.vue";
import Empty from "../../../components/Empty/index.vue";

export default {
  name: 'HomeData',
  components: {Empty, Loading, F2Uni},
  data() {
    return {
      current: 0,
      windowWidth: 0,
      loading: true,
      error: false,
      data: [],
      total: 0
    }
  },
  created() {
    this.windowWidth = this.$store.state.systemInfo.systemInfo.windowWidth || 0
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      Erp.miniappHomeData({data: {}}).then((res) => {
        this.total = res.data.stockMoney || 0
        this.data = [{
          name: '库存总额',
          money: res.data.stockMoney || 0,
          percent: 1,
          color:'#1890FF'
        }]
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
    },
    onInitChart: (F2Constructor, config, data) => {
      const chart = new F2Constructor.Chart(config)
      const map = {};

      const newData = data.map(item => {
        map[item.name] = item.money
        return {
          name: item.name,
          percent: item.percent,
          a: '1'
        }
      })

      chart.source(newData, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.legend({
        position: 'left',
        offsetY: 20,
        verticalAlign: 'middle',
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
          .color('name', data.map(item => item.color))
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
    top: 28px;
    left: 24px;
    font-size: 14px;

    .num {
      color: #19be6b;
    }
  }
}
</style>
