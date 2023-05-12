<template>
  <canvas
      :style="{width:`${width}px`,height:`${height}px`,margin:'auto'}"
      type="2d"
      canvas-id="f2-canvas"
      id="f2-canvas"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
  />
</template>

<script>
import F2 from '@antv/f2'

function wrapEvent(e) {
  if (!e) return
  if (!e.preventDefault) {
    e.preventDefault = function () {
    }
  }
  return e
}

export default {
  data() {
    return {
      canvasEl: null,
    }
  },
  props: {
    onInit: {
      type: Function,
      default: () => {
      }
    },
    width: {
      type: Number,
      default: () => 0
    },
    height: {
      type: Number,
      default: () => 170
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0]
    }
  },
  methods: {
    init() {
      const query = uni.createSelectorQuery().in(this)
      query.select('#f2-canvas').fields({
        node: true,
        size: true
      }).exec(res => {
        const {node} = res[0] || {}
        if (!node) {
          return
        }
        const context = node.getContext('2d') // 微信基础库2.7.0 以上支持
        const pixelRatio = uni.getSystemInfoSync().pixelRatio
        // 高清设置
        const width = this.width
        const height = this.height
        node.width = width * pixelRatio
        node.height = height * pixelRatio
        const config = {context, width, height, pixelRatio, padding: this.padding}
        const chart = this.onInit(F2, config)
        if (chart) {
          this.canvasEl = chart.get('el')
        }
      })
    },
    touchStart(e) {
      const canvasEl = this.canvasEl
      if (!canvasEl) {
        return
      }
      canvasEl.dispatchEvent('touchstart', wrapEvent(e))
    },
    touchMove(e) {
      const canvasEl = this.canvasEl
      if (!canvasEl) {
        return
      }
      canvasEl.dispatchEvent('touchmove', wrapEvent(e))
    },
    touchEnd(e) {
      const canvasEl = this.canvasEl
      if (!canvasEl) {
        return
      }
      canvasEl.dispatchEvent('touchend', wrapEvent(e))
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss">

</style>
