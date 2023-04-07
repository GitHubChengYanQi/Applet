<template>
  <view>
    <van-popup
        :overlay-style="overlayStyle"
        :show="visible"
        :z-index="999"
        @close="$emit('visiblChange',false)"
        position="bottom"
    >
      <view class='content'>
        <view v-if="!noStepper" class='calculation'>
          <button :disabled="Number(showNumber() || 0) <= min" @click="jianClick">
            <van-icon name="minus" />
          </button>
          <view class='value'>
            {{ showNumber() }}<span v-if="!defaultNumber" class='line'>|</span>
          </view>
          <button :disabled="Number(showNumber() || 0) >= max" @click="jiaClick">
            <van-icon name="plus" />
          </button>
        </view>
        <view class='numberKeyboard'>
          <view class='keyboard'>
            <view
                v-for="(item,index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
                :key="index"
                :class="['numberButton',item === 0 && 'zero']"
            >
              <button @click="numClick(item)">{{ item }}</button>
            </view>
            <view class='numberButton'>
              <button :disabled="!decimal" @click="dianClick">.</button>
            </view>
          </view>
          <view class='actions'>
            <view class='numberButton'>
              <button @click="back">
                <van-icon name="arrow-left" />
              </button>
            </view>
            <view :class="['numberButton', 'ok']">
              <button @click="ok">
                确定
              </button>
            </view>
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
export default {
  name: 'Keybord',
  props: {
    overlayStyle: String,
    noMask: Boolean,
    popupClassName: String,
    noStepper: Boolean,
    visible: Boolean,
    value: String || Number,
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 999999
    },
    decimal: Number,
  },
  data() {
    return {
      number: '',
      defaultNumber: ''
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        this.number = ''
        this.defaultNumber = this.value || ''
      }
    }
  },
  methods: {
    decimalData() {
      let decimalLength;

      try {
        decimalLength = `${this.number}`.split('.')[1].length;
      } catch (e) {
        decimalLength = 0;
      }

      let step = '0.';
      if (decimalLength === 0) {
        step = 1;
      } else {
        for (let i = 0; i < decimalLength; i++) {
          if (i === decimalLength - 1) {
            step += 1;
          } else {
            step += 0;
          }
        }
      }
      return {
        decimalLength,
        step
      }
    },
    showNumber() {
      return this.number || this.defaultNumber
    },
    numberChange(num) {
      this.number = num
      this.defaultNumber = ''
    },
    jianClick() {
      const newValue = Number((Number(this.showNumber()) - Number(this.decimalData().step)).toFixed(this.decimalData().decimalLength));
      this.numberChange(newValue);
    },
    jiaClick() {
      const newValue = Number((Number(this.showNumber()) + Number(this.decimalData().step)).toFixed(this.decimalData().decimalLength));
      this.numberChange(newValue);
    },
    numClick(item) {
      if (this.decimal) {
        if (this.number > 999999999) {
          return;
        }
        if (this.decimalData().decimalLength < this.decimal) {
          this.numberChange(`${this.number || ''}` + item);
        }
      } else {
        const num = Number(this.number);
        if (num > 999999999) {
          return;
        }
        this.numberChange(`${num || ''}` + item);
      }
      this.$emit('numberClick', item)
    },
    dianClick() {
      if (`${this.number}`.indexOf('.') === -1) {
        this.numberChange((this.number || 0) + '.');
      }
    },
    back() {
      this.$emit('onBack')
      const numbers = `${this.number}`.split('');
      const newValue = numbers.filter((item, index) => {
        return index !== numbers.length - 1;
      }).join('');
      this.numberChange(newValue);
    },
    ok() {
      this.$emit('onConfirm')
      this.$emit('visiblChange', false)
      this.save();
    },
    save() {
      const num = Number(this.showNumber());
      let newValue = num;
      if (num < this.min) {
        newValue = this.min;
      }
      if (num > this.max) {
        newValue = this.max;
      }
      this.$emit('onChange', newValue)
    }
  }
}
</script>

<style lang="scss">
.content {
  background-color: $body-color;

  .calculation {
    display: flex;
    align-items: center;
    background-color: #fff;

    .value {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      padding: 4px;
      max-width: 30%;
      flex-grow: 1;
      border-left: solid 1px #f5f5f5;
      border-right: solid 1px #f5f5f5;
      overflow: hidden;
      font-size: 24px;
    }

    button {
      border: none;
      flex-grow: 1;
      border-radius: 0;
      background-color: rgba(255, 255, 255, 0.95);
      font-size: 24px;
      height: 45px;
      line-height: 45px;
    }
  }

  .numberKeyboard {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;

    .keyboard {
      display: flex;
      flex-wrap: wrap;
      width: 75%;
    }

    .actions {
      width: 25%;
      padding-right: 10px;

      .numberButton {
        width: 100%;

        button {
          background-color: #c5d2e1;
        }
      }
    }

    .numberButton {
      width: calc((100% - 24px) / 3);
      padding: 4px;

      .clear {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button {
        border-radius: 8px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0;
        background-color: rgba(255, 255, 255, 0.95);
        border: none;
        box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.3);
        font-size: 24px;
      }
    }

    .ok {
      button {
        display: flex;
        height: 166px;
        align-items: center;
        justify-content: center;
      }
    }

    .zero {
      width: calc((100% - 24px) / 3 * 2 + 8px)
    }
  }


}

@keyframes cursor-blinks {
  0% {
    opacity: 1;
    display: block;
  }
  50% {
    opacity: 0;
    display: none;
  }
  100% {
    opacity: 1;
    display: block;
  }
}

.line {
  animation: cursor-blinks 1.5s infinite steps(1, start);
  font-size: 24px;
  margin-top: -4px;
  color: #7c7a7a;
}
</style>
