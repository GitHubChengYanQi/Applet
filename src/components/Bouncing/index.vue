<template>
  <view>
    <uni-badge class="uni-badge-left-margin" :text="num" absolute="rightTop" :offset="[-3, -3]" size="small">
      <view class='box' :style="{ height: `${height || size || 100}px`, width: `${width || size || 100}px`}">
        <view
            :style="{ height: `${height || size || 100}px`, width: `${width || size || 100}px`}"
            :class="['ball' ,animation && 'jump']"
        >
          <image :src='img' alt='' style="height: 100%;width: 100%" />
        </view>
      </view>
    </uni-badge>
  </view>
</template>

<script>
export default {
  name: 'Bouncing',
  props: [
    'img',
    'size',
    'number',
    'color',
    'height',
    'width',
  ],
  watch: {
    number(number) {
      if (typeof number === 'number') {
        this.num = number
      }
    }
  },
  data() {
    return {
      num: 0,
      animation: false
    }
  },
  mounted() {

  },
  methods: {
    jump(after, number = 1) {
      this.animation = true
      setTimeout(() => {
        if (number !== null) {
          this.num = this.num + number
        }
        this.animation = false
        after();
        this.$emit('addAfter')
      }, 500)
    }
  }
}
</script>

<style lang="scss">
/* 3D Bouncing ball */
.jump {
  animation: jump .4s;
}

.box {
  position: relative;
}

.ball {
  position: absolute;
  bottom: 0;
  //animation: jump .5s infinite;
  left: 0;
  right: 0;
  margin: auto;
}

/* Animations */
@keyframes jump {
  0% {
    height: 100%;
    width: 80%;
  }
  50% {
    height: 80%;
    width: 100%;
  }
  100% {
    height: 100%;
    width: 80%;
  }
}

</style>
