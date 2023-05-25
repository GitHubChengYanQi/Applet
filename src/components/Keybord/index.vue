<template>
  <view>
    <u-popup
        :overlay="overlay"
        :show="visible"
        @close="$emit('close')"
    >
      <view class='Keybord-content'>
        <view v-if="!noStepper" class='Keybord-calculation'>
          <button :disabled="Number(showNumber() || 0) <= min" @click="jianClick">
            <u-icon name="minus" />
          </button>
          <view class='Keybord-value'>
            {{ showNumber() }}<span v-if="!defaultNumber" class='Keybord-line'>|</span>
          </view>
          <button :disabled="Number(showNumber() || 0) >= max" @click="jiaClick">
            <u-icon name="plus" />
          </button>
        </view>
        <view class='Keybord-numberKeyboard'>
          <view class='Keybord-keyboard'>
            <view
                v-for="(item,index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
                :key="index"
                :class="['Keybord-numberButton',item === 0 && 'Keybord-zero']"
            >
              <button @click="numClick(item)">{{ item }}</button>
            </view>
            <view class='Keybord-numberButton'>
              <button :disabled="!decimal" @click="dianClick">.</button>
            </view>
          </view>
          <view class='Keybord-actions'>
            <view class='Keybord-numberButton'>
              <button @click="back">
                <u-icon name="arrow-left" size="24" />
              </button>
            </view>
            <view :class="['Keybord-numberButton', 'Keybord-ok']">
              <button @click="ok">
                确定
              </button>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'Keybord',
  props: {
    overlay: {
      type: Boolean,
      default: () => true
    },
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
      this.$emit('onConfirm')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.Keybord-content {
  background-color: $body-color;

  .Keybord-calculation {
    display: flex;
    align-items: center;
    background-color: #fff;

    .Keybord-value {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      padding: 0 4px;
      width: calc(50% - 10px);
      border-left: solid 1px #f5f5f5;
      border-right: solid 1px #f5f5f5;
      overflow: hidden;
      font-size: 24px;
      height: 45px;
    }

    button {
      border: none;
      flex-grow: 1;
      border-radius: 0;
      background-color: rgba(255, 255, 255, 0.95);
      font-size: 24px;
      height: 45px;
      line-height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: none
      }
    }
  }

  .Keybord-numberKeyboard {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;

    .Keybord-keyboard {
      display: flex;
      flex-wrap: wrap;
      width: 75%;
    }

    .Keybord-actions {
      width: 25%;
      padding-right: 10px;

      .Keybord-numberButton {
        width: 100%;

        button {
          background-color: #c5d2e1;
        }
      }
    }

    .Keybord-numberButton {
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
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .Keybord-ok {
      button {
        display: flex;
        height: 166px;
        align-items: center;
        justify-content: center;
      }
    }

    .Keybord-zero {
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

.Keybord-line {
  animation: cursor-blinks 1.5s infinite steps(1, start);
  font-size: 24px;
  margin-top: -4px;
  color: #7c7a7a;
}
</style>
