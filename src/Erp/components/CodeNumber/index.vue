<template>
  <view>
    <view class='codeInput'>
      <view class='title'>{{ title }}</view>
      <view class='inputNumber'>
        <view
            v-for="(item, index) in code"
            :key="index"
            class='codeItem'
            @click="visivble = true"
        >
          <view
              :class="['box', isNext(item,index) && 'next']"
              :style="{ width: `${inputSize}px`,height: `${inputSize}px`,lineHeight: `${inputSize}px`,fontSize: `${fontSize}px`}"
          >
            {{ numberShow(item.number) }}
          </view>
          <view
              v-if="code.length !== index + 1"
              class='space'
              :style="{ margin: `${spaceSize}px`, width: `${spaceSize}px` }"
          />
        </view>
      </view>
      <Divider>
        <view class='divider'>
          或
        </view>
      </Divider>
      <view class='scan'>
        <view class='scanStyle' @click="scan">
          <Icon icon="icon-dibudaohang-saoma-copy" size="30" />
        </view>
      </view>
      <slot name="other"></slot>
    </view>

    <Keybord
        :overlay="false"
        no-mask
        noStepper
        :visible="open || visible"
        @visiblChange="(value)=>visible = value"
        @numberClick="numberClick"
        @onConfirm="onConfirm"
        @onBack="onBack"
    />
  </view>
</template>

<script>
import Keybord from "../../../components/Keybord";
import {Message} from "../../../components/Message";
import Icon from "../../../components/Icon";
import Divider from "../../../components/Divider";

export default {
  name: 'CodeNumber',
  components: {Divider, Icon, Keybord},
  props: {
    open: Boolean,
    codeNumber: {
      type: Number,
      default() {
        return 4
      }
    },
    inputSize: {
      type: Number,
      default() {
        return 40
      }
    },
    fontSize: {
      type: Number,
      default() {
        return 20
      }
    },
    spaceSize: {
      type: Number,
      default() {
        return 11
      }
    },
    title: String
  },
  data() {
    return {
      code: []
    }
  },
  mounted() {
    this.initialCode()
  },
  methods: {
    initialCode() {
      const array = [];
      for (let i = 0; i < this.codeNumber; i++) {
        array.push({key: i});
      }
      this.code = array
    },
    isNext(item, index) {
      let next = false;
      if (index === 0 && item.number === undefined) {
        next = true;
      } else if (this.code[index - 1]?.number !== undefined && item.number === undefined) {
        next = true;
      }
      return next
    },
    numberClick(number) {
      let ok = 0;
      const newCode = this.code.map((item, index) => {
        if (!item.number && !ok && item.number !== 0) {
          ok = index + 1;
          return {...item, number};
        }
        return item;
      });
      if (ok === this.code.length) {
        this.$emit('onSuccess', newCode.map(item => item.number).join(''))
      }
      this.code = newCode
    },
    onConfirm() {
      this.$emit('onSuccess', this.code.map(item => item.number).join(''))
    },
    onBack() {
      this.code = this.code.map((item, index) => {
        if (index === this.code.map(item => item.number).join('').length - 1) {
          return {key: item.key};
        }
        return item;
      })
    },
    numberShow(number){
      return typeof number === 'number' ? number : ''
    },
    scan() {
      const _this = this
      uni.scanCode({
        onlyFromCamera: true,
        success: function (res) {
          const code = res.result.split('code=')[1]
          if (code) {
            _this.code = code
            _this.$emit('onSuccess', code)
          } else {
            Message.errorToast('请扫领料码！')
          }
        }
      });
    }
  }
}
</script>

<style lang="scss">
.codeInput {
  text-align: center;
  padding: 20% 24px;
  height: 100vh;

  .title {
    font-size: 20px;
    color: #808080;
  }

  .divider {
    font-size: 20px;
    color: #808080;
    margin: 0;
    border-color: #F5F5F5;
  }

  .inputNumber {
    padding: 61px 0;
    display: flex;
    justify-content: center;

    .codeItem {
      display: flex;
      align-items: center;

      .box {
        text-align: center;
        font-weight: bold;
        border-radius: 2px;
        background: #f8f8f800;
        border-bottom: solid 2px #d3d3d3;
        color: #3D3D3D;
      }

      .next {
        border-bottom: solid 2px $primary-color;
      }

      .space {
        height: 1px;
        background-color: #E8E8E8;
      }
    }


  }
}

.scan {
  margin-top: 31px;

  .scanStyle {
    width: 80px;
    height: 80px;
    background: #D9D9D9;
    border-radius: 50px;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }


}

</style>
