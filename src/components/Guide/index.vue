<template>
  <view>
    <view class="body" @click="click" />
    <view class="guide">
      <view class="header">
        <u-icon name="close" @click="click" />
      </view>
      <view class="content">
        {{ steps[current].text }}
      </view>
      <view class="footer" :style="{paddingBottom: `${safeAreaHeight(this,8)}px`}">
        <view>
          {{ current >= 9 ? current : '0' + (current + 1) }} / {{
            steps.length > 10 ? steps.length : '0' + steps.length
          }}
        </view>
        <view class="next" @click="next">
          {{ current === steps.length - 1 ? '完成' : '下一步' }}
        </view>
      </view>
    </view>
  </view>

</template>

<script>
import {getLocalParmas, safeAreaHeight} from "../../util/Tools";

export default {
  name: 'Guide',
  data() {
    return {
      safeAreaHeight,
    }
  },
  computed: {
    current() {
      return this.$store.state.guide.current
    },
    steps() {
      return this.$store.state.guide.steps
    }
  },
  created() {
    const currentPage = this.steps[this.current].page

    const firstPage = this.steps[0].page

    if (this.current === 0 && getLocalParmas().route !== firstPage) {
      uni.reLaunch({
        url: firstPage
      })
    } else if (currentPage !== getLocalParmas().route) {
      this.$store.commit("guide/close")
    }

  },
  methods: {
    click() {
      this.$store.commit("guide/close")
    },
    next() {
      if (this.current === this.steps.length - 1) {
        this.$store.commit("guide/close")
        return
      }
      uni.reLaunch({
        url: this.steps[this.current + 1].page
      })
      this.$store.commit("guide/next")
    }
  }
}
</script>

<style lang="scss">
.body {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 98;
}

.guide {
  position: fixed;
  bottom: 0;
  width: calc(100% - 24px);
  padding: 0 12px;
  opacity: 0.7;
  background: #000000;
  color: #fff;
  z-index: 99;

  .header {
    padding-top: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .content {
    padding: 14px 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    view {
      font-size: 14px;
    }

    .next {
      border-radius: 30px;
      border: 1px solid #FFFFFF;
      padding: 6px 22px;
    }
  }
}
</style>
