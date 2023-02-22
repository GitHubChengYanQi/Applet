<template>
  <view v-if="name">
    <view class="float" :style="{bottom:`${bottom || 100}px`,right:`${right || 24}px`}">
      <view :id="bouncingId" class='actions'>
        <view class='action'>
          <view class='actionButton'>
            <uni-badge
                class="uni-badge-left-margin"
                :text="num"
                absolute="rightTop"
                :offset="[-3, -3]"
                size="small"
            >
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
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Bouncing',
  props: [
    'bouncingId',
    'name',
    'img',
    'size',
    'number',
    'color',
    'height',
    'width',
    'bottom',
    'right'
  ],
  computed: {
    num() {
      const shopData = this.$store.state.bouncing[this.name]
      if (shopData) {
        return shopData.num
      } else {
        return 0
      }
    },
    animation() {
      const shopData = this.$store.state.bouncing[this.name]
      if (!shopData) {
        return false
      }
      const status = shopData.animation
      if (status === false) {
        this.$emit('addAfter')
      }
      return status
    }
  },
  mounted() {
    this.numChange(this.number)
  },
  watch: {
    number(number) {
      this.numChange(number)
    }
  },
  methods: {
    numChange(number) {
      if (typeof number === 'number') {
        this.$store.commit('bouncing/number', {name: this.name, number})
      }
    }
  }
}
</script>

<style lang="scss">
.float {
  position: fixed;

  .actions, .action {
    display: flex;
    flex-direction: column;
    font-size: 10px;
    align-items: center;
    color: #3D3D3D;
    gap: 8px;

    :global .ant-avatar {
      background-color: $body-color;
    }

    .actionButton {
      border-radius: 100%;
      background-color: $body-color;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 24px;
      }
    }


    .text {
      padding: 4px 0 6px;
    }

    .dimension {
      width: 24px;
      height: 24px;
      //background-color: var(--body--background--color);
    }
  }

}

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
